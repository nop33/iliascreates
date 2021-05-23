import React from "react"

import Intro from "../components/intro"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Websites = ({ location }) => {
  return (
    <Layout location={location}>
      <SEO
        title="I build apps | Ilias creates"
        description="A list of apps that I have built."
      />
      <Intro>
        <p>
          These are some of the apps that I built in my free time to solve
          personal problems.
        </p>
        <ul>
          <li>
            <a href="https://github.com/nop33/flatwise">
              <span role="img" aria-label="house">
                🏠
              </span>{" "}
              Flatwise
            </a>
          </li>
          <li>
            <a href="https://github.com/nop33/tracklists">
              <span role="img" aria-label="music  ">
                🎵
              </span>{" "}
              Tracklists
            </a>
          </li>
        </ul>
      </Intro>
    </Layout>
  )
}

export default Websites
