import React from "react"

import Intro from "../components/intro"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Websites = ({ location }) => {
  return (
    <Layout location={location}>
      <SEO
        title="I build websites | Ilias creates"
        description="I can build blazing fast websites to present your company, organization, project or yourself in no time."
      />
      <Intro>
        Do you need a{" "}
        <span role="img" aria-label="fast">
          ⚡
        </span>{" "}
        website? Let's talk!
        <br />
        Drop me an <a href="mailto:websites@iliascreates.com">email</a>.
      </Intro>
    </Layout>
  )
}

export default Websites
