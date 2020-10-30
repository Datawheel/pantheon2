import React from "react";
import "components/utils/PersonImage.css";

const PersonImage = ({alt, className, src, fallbackSrc}) => <div
  className="image"
  dangerouslySetInnerHTML={{
    __html: `<img src="${src}" class="${className}" alt="${alt}" data-fallback=${fallbackSrc} onerror="this.onerror=null;this.src=this.dataset.fallback;" />`
  }}
/>;

export default PersonImage;
