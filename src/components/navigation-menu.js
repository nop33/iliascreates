import React from "react"

import { Link } from "gatsby"

import styles from "./navigation-menu.module.scss"

const NavigationMenu = ({ isHome }) => {
  return (
    <div className={styles.navigationMenu}>
      <div className={styles.navigationMenuStart}>
        {!isHome && (
          <Link to="/" className={styles.navigationMenuItem}>
            Home
          </Link>
        )}
      </div>
      <ul className={styles.navigationMenuEnd}>
        <li className={styles.navigationMenuItem}>
          <Link to="/apps/">Apps</Link>
        </li>
        <li className={styles.navigationMenuItem}>
          <Link to="/websites/">Websites</Link>
        </li>
        <li className={styles.navigationMenuItem}>
          <Link to="/blog/">Dev blog</Link>
        </li>
      </ul>
    </div>
  )
}

export default NavigationMenu
