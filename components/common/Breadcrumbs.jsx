import Link from "next/link";
import "./Breadcrumbs.css";

export default function Breadcrumbs({items, ariaLabel = "Breadcrumb"}) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label={ariaLabel}>
      <ol className="breadcrumbs-list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li className="breadcrumbs-item" key={item.href || item.label}>
              {isLast || !item.href ? (
                <span className="breadcrumbs-current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link className="breadcrumbs-link" href={item.href}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
