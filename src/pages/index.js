import React from "react"
import { graphql } from "gatsby"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Homepage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={siteTitle} />
      <Bio />
      <ul>
        <li>
          <Link to="/blog/">Dev blog</Link>
        </li>
        <li>
          <Link to="/dj-sets/">DJ sets</Link>
        </li>
      </ul>
    </Layout>
  )
}

export default Homepage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
