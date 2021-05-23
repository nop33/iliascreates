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
        <p style={{ marginTop: "var(--spacing-12)" }}>
          Here are some websites that I've brought to life:
        </p>
        <ul>
          <li>
            <a href="https://simoninstitute.ch/">simoninstitute.ch</a>
          </li>
          <li>
            <a href="https://www.conscioussapiens.com/">conscioussapiens.com</a>
          </li>
          <li>
            <a href="https://petro-logistics.com/">petro-logistics.com</a>
          </li>
          <li>
            <a href="https://bity.com/">bity.com</a>
          </li>
          <li>
            <a href="https://burgenstockresort.com/">burgenstockresort.com</a>
          </li>
          <li>
            <a href="https://getindico.io/">getindico.io</a>
          </li>
        </ul>
      </Intro>
    </Layout>
  )
}

export default Websites
