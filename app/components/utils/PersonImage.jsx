import React from "react";
import "components/utils/PersonImage.css";

const PersonImage = ({alt, src, fallbackSrc}) => {
  return (<div
    className="image"
    dangerouslySetInnerHTML={{
      __html: `<img src="${src}" alt="${alt}" data-fallback=${fallbackSrc} onerror="this.onerror=null;this.src=this.dataset.fallback;" />`
    }}
  />)
}

export default PersonImage;
