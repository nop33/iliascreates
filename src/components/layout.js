import React from "react"

import NavigationMenu from "../components/navigation-menu"

const Layout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <NavigationMenu isHome={isRootPath} />
      <main>{children}</main>
    </div>
  )
}

export default Layout
