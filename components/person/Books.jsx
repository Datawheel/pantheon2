import SectionLayout from "../common/SectionLayout";
import "./Works.css";

async function getBooks(personId) {
  const res = await fetch(`https://pantheon.world/api/books?id=${personId}`);
  return res.json();
}

export default async function Books({person, slug, title}) {
  if (person.occupation.id !== "WRITER") {
    return null;
  }
  const books = await getBooks(person.id);

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        {books.length ? (
          <div className="card-list">
            {books.map(book => (
              <div href="#" className="work-card book" key={book.totle}>
                <div
                  className="thumb"
                  style={
                    book.cover ? {backgroundImage: `url('${book.cover}')`} : {}
                  }
                ></div>
                <div className="info-group">
                  <div className="title" title={book.title}>
                    {book.title}
                  </div>
                  {book.categories ? (
                    <div className="subtitle">
                      {book.categories.slice(0, 3).map((category, index) => (
                        <span key={`category_${index}`}>
                          {(index ? ", " : "") + category}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {book.description ? (
                    <div className="description">{book.description}</div>
                  ) : null}
                  {book.first_published || book.average_rating ? (
                    <div className="info-group-footer">
                      <span>{book.first_published}</span>
                      {book.average_rating ? (
                        <span>{book.average_rating} / 5</span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </SectionLayout>
  );
}
