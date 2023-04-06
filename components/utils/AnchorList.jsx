import React from "react";
import {Tooltip} from "@blueprintjs/core";

const AnchorList = ({items, name, tooltip, url, noAnd, newWindow}) =>
  <span>
    {items.map((item, index) =>
      <span key={item.id || index}>
        { !noAnd && index && index === items.length - 1 ? " and " : null }
        {tooltip
          ? <Tooltip content={tooltip(item)}><a href={url(item)} target={newWindow ? "_blank" : "_self"} rel={newWindow ? "noopener" : null}>{name(item)}</a></Tooltip>
          : <a href={url(item)} target={newWindow ? "_blank" : "_self"}>{name(item)}</a>}
        { items.length !== 2 ? index < items.length - 1 ? ", " : null : null }
      </span>
    )}
  </span>;

export default AnchorList;
