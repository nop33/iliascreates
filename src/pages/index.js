import React from "react";
import { graphql } from "gatsby";

import Intro from "../components/intro";
import Layout from "../components/layout";
import SEO from "../components/seo";

const Homepage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;

  return (
    <Layout location={location}>
      <SEO title={siteTitle} description="I like crafting digital stuff." />

      <Intro>
        Hello{" "}
        <span role="img" aria-label="hello">
          👋
        </span>
        <br />
        I'm Ilias and I like crafting digital stuff. <br />
        Welcome to my lil' internet corner, enjoy your stay!
      </Intro>
    </Layout>
  );
};

export default Homepage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
