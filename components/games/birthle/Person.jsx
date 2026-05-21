"use client";
import React from "react";
import PersonImage from "@/components/utils/PersonImage";

export default function Person({data, onClick, isBoardItem, dataKey}) {
  return (
    <li
      className={`${isBoardItem ? "board-row-list-item" : "panel-list-item"}`}
      key={dataKey ? `${dataKey}-${data.id}` : data.id.toString()}
      onClick={onClick}
    >
      <div
        className={`card ${isBoardItem ? "board-item" : ""}`}
        id={data.id}
        key={dataKey ? `${dataKey}-${data.id}` : data.id.toString()}
      >
        <PersonImage
          person={data}
          className="card-image"
          src={data.imgURL}
          key={`Photo${data.id}`}
          alt={`Photo of ${data.name}`}
          wrap={false}
        />
        {!isBoardItem ? (
          <div key={`cardTitle_${data.id}`} className="card-title">
            {data.name}
          </div>
        ) : null}
      </div>
    </li>
  );
}
