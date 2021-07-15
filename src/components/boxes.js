import React from "react";

import styles from "./boxes.module.scss";

const Boxes = ({ boxesData, columns }) => {
  return (
    <ul
      className={`${styles.boxes} ${
        parseInt(columns) === 2 ? styles.twoColumns : ""
      }`}
    >
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
