import React from "react";

import { intro } from "./intro.module.scss";

const Intro = ({ children }) => {
  return <div className={intro}>{children}</div>;
};

export default Intro;
