import "./News.css";
import SectionLayout from "../common/SectionLayout";

async function getNewsArticles(personId) {
  const res = await fetch(`https://pantheon.world/api/news?pid=${personId}`);
  return res.json();
}

export default async function News({person, slug, title}) {
  const newsArticles = await getNewsArticles(person.id);
  if (!newsArticles.length) {
    return null;
  }

  return (
    <SectionLayout slug={slug} title={title}>
      <div className="news-container">
        {newsArticles.length ? (
          <div className="card-list">
            {newsArticles.map(news =>
              news.article ? (
                <a
                  href={news.article.url}
                  className="news-card"
                  key={news.article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className="thumb"
                    style={{
                      backgroundImage: news.article.urlToImage
                        ? `url('${news.article.urlToImage}')`
                        : "url('/images/not-found/news-article-no-image.jpg')",
                    }}
                  >
                    {news.article.source ? (
                      <div className="src">{news.article.source.name}</div>
                    ) : null}
                  </div>
                  <div className="info-group">
                    <div className="title">{news.article.title}</div>
                    <div className="description">
                      {news.article.description}
                    </div>
                  </div>
                  <div className="info-footer">
                    {news.article.author ? (
                      <div className="author">
                        {/* <Icon icon="person" iconSize={12} /> */}
                        {news.article.author}
                      </div>
                    ) : null}
                    <div className="date">
                      {/* <Icon icon="calendar" iconSize={12} />{" "} */}
                      {new Date(news.article.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </a>
              ) : null
            )}
          </div>
        ) : null}
      </div>
    </SectionLayout>
  );
}
