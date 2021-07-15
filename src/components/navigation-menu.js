import React from "react";

import { Link } from "gatsby";

import {
  navigationMenu,
  navigationMenuStart,
  navigationMenuItem,
  navigationMenuEnd,
} from "./navigation-menu.module.scss";

const NavigationMenu = ({ isHome }) => {
  return (
    <div className={navigationMenu}>
      <div className={navigationMenuStart}>
        {!isHome && (
          <Link to="/" className={navigationMenuItem}>
            Home
          </Link>
        )}
      </div>
      <ul className={navigationMenuEnd}>
        <li className={navigationMenuItem}>
          <Link to="/music/">Music</Link>
        </li>
        <li className={navigationMenuItem}>
          <Link to="/apps/">Apps</Link>
        </li>
        <li className={navigationMenuItem}>
          <Link to="/websites/">Websites</Link>
        </li>
        <li className={navigationMenuItem}>
          <Link to="/blog/">Dev blog</Link>
        </li>
      </ul>
    </div>
  );
};

export default NavigationMenu;
