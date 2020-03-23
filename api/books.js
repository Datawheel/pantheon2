const axios = require("axios");
const createThrottle = require("async-throttle");

module.exports = function(app) {

  app.get("/api/books", async(req, res) => {
    // grab id from query param (if missing return empty array)
    const id = req.query.id;
    if (!id) return res.json([]);

    // try to find person in patheon ID (if missing return empty array)
    const personPantheonResp = await axios.get(`https://api.pantheon.world/person?id=eq.${id}&select=name,slug,occupation.occupation_name`).catch(e => (console.log(`[Books API]: No Person in DB with id: ${id}`), {data: []}));
    if (!personPantheonResp.data.length) return res.json([]);

    // ensure the person is in fact a writer (classification could expand in the future)
    const person = personPantheonResp.data[0];
    if (person.occupation !== "WRITER") return res.json([]);

    // check if we've already scraped their books
    const booksFromPantheonDbResp = await axios.get(`https://api.pantheon.world/book?pid=eq.${id}`).catch(e => (console.log("[Books API] Error finding books in db:", e), {data: []}));
    if (booksFromPantheonDbResp.data && booksFromPantheonDbResp.data.length) {
      return res.json(booksFromPantheonDbResp.data);
    }

    const openLibURL = `http://openlibrary.org/search.json?author=${encodeURIComponent(person.name)}`;
    const openLibResp = await axios.get(openLibURL).catch(e => (console.log(`Open Library API Error: No results for ${person.name} found.`), {data: []}));
    const openLibJson = openLibResp.data;
    if (!openLibJson.docs) {
      return res.json([]);
    }
    if (!openLibJson.docs.length) {
      console.warn(`No books in Open Library for ${person.name}`);
      return res.json([]);
    }
    // const todaysDate = new Date();
    const openLibBooks = openLibJson.docs
      .filter(book => book.isbn || book.oclc)
      .slice(0, 6)
      .map(book => ({
        title: book.title || book.title_suggest,
        cover: `http://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
        isbn: book.isbn ? book.isbn.slice(0, 5) : null,
        oclc: book.oclc ? book.oclc.slice(0, 5) : null,
        gid: book.id_google ? book.id_google.slice(0, 5) : null,
        editions: book.edition_count,
        first_published: book.first_publish_year,
        last_fetch: new Date().toISOString().substring(0, 10),
        pid: id,
        slug: person.slug
      }));
    // return res.json(openLibBooks);

    let books = [];
    for (let i = 0; i < openLibBooks.length; i++) {
      const book = openLibBooks[i];
      let gbookResult = {};

      const gBooksApiUrls = book.gid
        ? book.gid.slice(0, 5).map(gid => `https://www.googleapis.com/books/v1/volumes/${gid}`)
        : book.oclc
          ? book.oclc.slice(0, 5).map(oclc => `https://www.googleapis.com/books/v1/volumes?q=oclc:${oclc}`)
          : book.isbn.slice(0, 5).map(isbn => `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      // throttle API queries to 20 at a time
      const throttle = createThrottle(1);
      let thisGBookResults = await Promise.all(gBooksApiUrls.map(url => throttle(async() => {
        const res = await axios.get(url).catch(() => ({data: {items: []}}));
        // return res.data && res.data.items && res.data.items.length ? res.data.items[0] : null;
        if (res.data && res.data.items && res.data.items.length) {
          return res.data.items[0];
        }
        else if (res.data && !res.data.items) {
          return res.data;
        }
        return null;
      })));
      thisGBookResults = thisGBookResults.filter(Boolean).filter(b => b.volumeInfo && b.volumeInfo.language ? b.volumeInfo.language === "en" : true);

      if (thisGBookResults.length) {
        gbookResult = thisGBookResults[0];
      }

      books.push({
        ...book,
        gbooks_api_url: gbookResult.selfLink || null,
        description: gbookResult.volumeInfo ? gbookResult.volumeInfo.description || null : null,
        page_count: gbookResult.volumeInfo ? gbookResult.volumeInfo.pageCount || null : null,
        categories: gbookResult.volumeInfo ? gbookResult.volumeInfo.categories || null : null,
        average_rating: gbookResult.volumeInfo ? gbookResult.volumeInfo.averageRating || null : null,
        rating_count: gbookResult.volumeInfo ? gbookResult.volumeInfo.ratingsCount || null : null,
        snippet: gbookResult.searchInfo ? gbookResult.searchInfo.textSnippet || null : null
      });
    }
    books = books.filter(Boolean);

    // UPSERT via "Prefer: resolution=merge-duplicates" header
    const bookPosts = books.map(book => axios.post("https://api.pantheon.world/book", book, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
        "Prefer": "resolution=merge-duplicates"
      }
    }).catch(err => {
      console.log(`[Books API] unable to post book by ${person.name} to db.`);
      return {error: err};
    }));
    await Promise.all(bookPosts);
    return res.json(books);
  });
};
