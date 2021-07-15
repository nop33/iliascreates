import React from "react";

import { boxes, twoColumns } from "./boxes.module.scss";

const Boxes = ({ boxesData, columns }) => {
  return (
    <ul className={`${boxes} ${parseInt(columns) === 2 ? twoColumns : ""}`}>
      {boxesData.map((boxData) => {
        return (
          <li key={boxData.title}>
            <a href={boxData.url}>{boxData.title}</a>
          </li>
        );
      })}
    </ul>
  );
};

export default Boxes;
