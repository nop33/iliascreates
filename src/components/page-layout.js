import React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, siteTitle, children }) => {
  return (
    <div className="global-wrapper">
      <header className="global-header">
        <Link className="header-link-home" to="/">
          {siteTitle}
        </Link>
        <h1>{title}</h1>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout
