import "./Section.css";

export default function SectionLayout({children, slug, title}) {
  return (
    <section className="profile-section" key={slug}>
      <div className="section-head">
        <div className="section-title">
          <h4 id={slug}>{title}</h4>
        </div>
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}
