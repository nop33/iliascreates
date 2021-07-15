import React from "react";

import styles from "./mission.module.scss";

const Mission = ({ children }) => {
  return <div className={styles.mission}>{children}</div>;
};

export default Mission;
