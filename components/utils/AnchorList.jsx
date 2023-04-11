// import { Tooltip } from "@blueprintjs/core";
import Link from "next/link";

export default function AnchorList({
  items,
  name,
  tooltip,
  url,
  noAnd,
  newWindow,
}) {
  return (
    <span>
      {items.map((item, index) => (
        <span key={item.id || index}>
          {!noAnd && index && index === items.length - 1 ? " and " : null}
          <Link href={url(item)} target={newWindow ? "_blank" : "_self"}>
            {name(item)}
          </Link>
          {items.length !== 2 ? (index < items.length - 1 ? ", " : null) : null}
        </span>
      ))}
    </span>
  );
  // <span>
  //   {items.map((item, index) => (
  //     <span key={item.id || index}>
  //       {!noAnd && index && index === items.length - 1 ? " and " : null}
  //       {tooltip ? (
  //         <a
  //           href={url(item)}
  //           target={newWindow ? "_blank" : "_self"}
  //           rel={newWindow ? "noopener" : null}
  //         >
  //           {name(item)}
  //         </a>
  //       ) : (
  //         <Link href={url(item)} target={newWindow ? "_blank" : "_self"}>
  //           {name(item)}
  //         </Link>
  //       )}
  //       {items.length !== 2 ? (index < items.length - 1 ? ", " : null) : null}
  //     </span>
  //   ))}
  // </span>;
}
