import React from "react";
import { Link, graphql } from "gatsby";

import Intro from "../components/intro";
import Layout from "../components/layout";
import SEO from "../components/seo";

const BlogIndex = ({ data, location }) => {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout location={location}>
      <SEO
        title="Fighting dev impostor syndrome | Ilias creates"
        description="My dev blog with experiences I collect while working on cool stuff. My goal is to document pitfalls I encounter and help other devs fight their impostor syndrome."
      />
      <Intro>
        Fighting the dev impostor syndrome, one blog post at a time.{" "}
        <span role="img" aria-label="fight">
          🤺
        </span>
      </Intro>
      <hr />
      <ol style={{ listStyle: `none` }}>
        {posts.map((post) => {
          const title = post.frontmatter.title || post.fields.slug;

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          );
        })}
      </ol>
    </Layout>
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
      filter: { fields: { contentType: { eq: "blog" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`;
