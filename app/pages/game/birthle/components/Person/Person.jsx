import React from "react";
import { useState, useEffect } from "react";

export default function Person({ data, onClick, isBoardItem, dataKey }) {
  const [imgURL, setImgURL] = useState(data.imgURL);

  useEffect(() => {
    const img = new Image();
    img.src = data.imgURL;

    img.onerror = () => {
      setImgURL("https://pantheon.world/images/icons/icon-person.svg");
    };
  });

  return (
    <li
      className={`${isBoardItem ? "board-row-list-item" : "panel-list-item"}`}
      key={dataKey ? `${dataKey}-${data.id}` : data.id}
      onClick={onClick}
    >
      <div className={`card ${isBoardItem ? "board-item" : ""}`} id={data.id}>
        <img
          className="card-image"
          src={imgURL}
          alt={`Photo of ${data.name}`}
        />
        {!isBoardItem ? <div className="card-title">{data.name}</div> : null}
      </div>
    </li>
  );
}
