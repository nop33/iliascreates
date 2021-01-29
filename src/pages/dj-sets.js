import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import DjSet from "../components/dj-set"

const DjSets = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={siteTitle} />
      <DjSet>My dj set!</DjSet>
    </Layout>
  )
}

export default DjSets

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
