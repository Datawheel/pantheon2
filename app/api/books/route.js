const axios = require("axios");

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const searchParamId = searchParams.get("id");
  const id = searchParamId;
  if (!id) return Response.json([]);

  // try to find person in patheon ID (if missing return empty array)
  const personPantheonResp = await axios
    .get(
      `https://api.pantheon.world/person?id=eq.${id}&select=name,slug,occupation.occupation_name`
    )
    .catch(
      e => (
        console.log(`[Books API]: No Person in DB with id: ${id}`), {data: []}
      )
    );
  if (!personPantheonResp.data.length) return Response.json([]);

  // ensure the person is in fact a writer (classification could expand in the future)
  const person = personPantheonResp.data[0];
  if (person.occupation !== "WRITER") return Response.json([]);

  // check if we've already scraped their books
  const booksFromPantheonDbResp = await axios
    .get(`https://api.pantheon.world/book?pid=eq.${id}`)
    .catch(
      e => (
        console.log("[Books API] Error finding books in db:", e), {data: []}
      )
    );
  if (booksFromPantheonDbResp.data && booksFromPantheonDbResp.data.length) {
    return Response.json(booksFromPantheonDbResp.data);
  }

  const openLibURL = `http://openlibrary.org/search.json?author=${encodeURIComponent(
    person.name
  )}`;
  const openLibResp = await axios
    .get(openLibURL)
    .catch(
      e => (
        console.log(
          `Open Library API Error: No results for ${person.name} found.`
        ),
        {data: []}
      )
    );
  const openLibJson = openLibResp.data;
  if (!openLibJson.docs) {
    return Response.json([]);
  }
  if (!openLibJson.docs.length) {
    console.warn(`No books in Open Library for ${person.name}`);
    return Response.json([]);
  }
  // keep only top 6 by edition count
  const topBooks = openLibJson.docs
    .filter(b => b.key)
    .sort((a, b) => b.edition_count - a.edition_count)
    .slice(0, 6);
  // return Response.json(topBooks);
  const openLibWorksReqs = topBooks.map(b =>
    axios.get(`https://openlibrary.org${b.key}`, {
      headers: {Accept: "application/json"},
    })
  );
  const detailedWorksData = await axios
    .all(openLibWorksReqs)
    .then(
      axios.spread(
        (...responses) => responses.map(r => r.data)
        // use/access the results
      )
    )
    .catch(errors => {
      console.log("ERRORS!", errors);
    });
  // return Response.json(detailedWorksData);
  const cleanedBooksData = detailedWorksData.map(book => {
    const bookData = topBooks.find(b => b.key === book.key);
    return {
      pid: id,
      slug: person.slug,
      title: book.title,
      cover:
        book.covers && book.covers.length
          ? `http://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
          : null,
      isbn:
        bookData.isbn && bookData.isbn.length
          ? bookData.isbn.slice(0, 10)
          : null,
      oclc:
        bookData.oclc && bookData.oclc.length
          ? bookData.oclc.slice(0, 10)
          : null,
      editions: bookData.edition_count || null,
      first_published: bookData.first_publish_year || null,
      categories:
        book.subjects && book.subjects.length
          ? book.subjects.slice(0, 10)
          : null,
      description: book.description
        ? book.description.value || book.description
        : null,
      gid:
        bookData.id_google && bookData.id_google.length
          ? bookData.id_google.slice(0, 10)
          : null,
      id: book.key,
      links:
        book.links && book.links.length ? book.links.map(l => l.url) : null,
    };
  });

  const bookPosts = cleanedBooksData.map(book =>
    axios
      .post(
        "https://api.pantheon.world/book?columns=pid,slug,title,cover,isbn,oclc,editions,first_published,categories,description,gid,key",
        book,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization":
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZGVwbG95In0.Es95xLgTB1583Sxh8MvamXIE-xEV0QsNFlRFVOq_we8",
            "Prefer": "resolution=merge-duplicates",
          },
        }
      )
      .catch(err => {
        console.log(`[Books API] unable to post book by ${person.name} to db.`);
        console.log(err);
        return {error: err};
      })
  );

  await Promise.all(bookPosts);
  return Response.json(cleanedBooksData);
}
