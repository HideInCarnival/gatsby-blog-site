/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"

type props = {
  children: React.ReactElement[]
}
const Layout: React.FC<props> = ({children}) => {
  return (
    <div className="layout mx-auto grid grid-cols-desk grid-rows-1 h-screen font-sans xs:block">
      { children }
    </div>
  )
}

export default Layout
