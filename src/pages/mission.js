import React from "react";
import { graphql } from "gatsby";

import PageLayout from "../components/page-layout";
import SEO from "../components/seo";
import Mission from "../components/mission";

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title;
  const page = data.allMarkdownRemark.nodes[0];
  const pageData = page.frontmatter;

  return (
    <PageLayout
      location={location}
      title={pageData.title}
      siteTitle={siteTitle}
    >
      <SEO
        title={pageData.title || siteTitle}
        description={pageData.description}
      />
      <Mission>
        <div dangerouslySetInnerHTML={{ __html: page.html }}></div>
      </Mission>
    </PageLayout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/page/mission.md/" } }
    ) {
      nodes {
        excerpt
        html
        fields {
          slug
        }
        frontmatter {
          title
          description
        }
      }
    }
  }
`;
