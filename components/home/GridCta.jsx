import Link from "next/link";

export default function GridCta({href, label}) {
  if (!href || !label) {
    return null;
  }

  return (
    <div className="grid-cta-container">
      <Link href={href} className="grid-cta-link">
        <span>{label}</span>
        <span className="grid-cta-arrow" aria-hidden="true">
          →
        </span>
      </Link>
    </div>
  );
}
