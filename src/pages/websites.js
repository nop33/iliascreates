import React from "react"

import Intro from "../components/intro"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Websites = ({ location }) => {
  return (
    <Layout location={location}>
      <SEO title="I build websites" />
      <Intro>
        Do you need a{" "}
        <span role="img" aria-label="fast">
          ⚡
        </span>{" "}
        website? Let's talk!
        <br />
        Contact me at hi [at] iliascreates.com.
      </Intro>
    </Layout>
  )
}

export default Websites
