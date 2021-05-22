import React from "react"

import styles from "./intro.module.scss"

const Intro = ({ children }) => {
  return <div className={styles.intro}>{children}</div>
}

export default Intro
