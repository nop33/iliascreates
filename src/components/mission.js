import React from "react";

import { mission } from "./mission.module.scss";

const Mission = ({ children }) => {
  return <div className={mission}>{children}</div>;
};

export default Mission;
