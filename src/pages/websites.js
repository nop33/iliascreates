import React from "react"

import Boxes from "../components/boxes"
import Intro from "../components/intro"
import Layout from "../components/layout"
import SEO from "../components/seo"

import websitesData from "../../content/data/websites.yaml"

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
        <p style={{ marginTop: "var(--spacing-12)" }}>
          Here are some websites that I've brought to life:
        </p>
        <Boxes boxesData={websitesData} columns="2" />
      </Intro>
    </Layout>
  )
}

export default Websites
