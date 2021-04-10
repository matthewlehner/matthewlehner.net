import { graphql } from "gatsby";
import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import Layout from "../components/layout";
import CoverPhoto from "../components/cover-photo";

const Template = ({ data: { markdownRemark: post }, location }) => (
  <Layout location={location}>
    <article
      className="mx-auto mt-6 max-w-prose text-lg"
      itemScope=""
      itemType="http://schema.org/Article"
    >
      <Helmet>
        <title>{`${post.frontmatter.title}`}</title>
        <meta
          name="description"
          content={post.frontmatter.description || post.excerpt}
        />
      </Helmet>
      <CoverPhoto image={post.frontmatter.cover_image} card />
      <header className="my-6 md:my-12">
        <h1
          className="mb-1 text-5xl font-semibold text-gray-700 dark:text-gray-300"
          itemProp="headline"
        >
          {post.frontmatter.title}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          <time dateTime={post.frontmatter.rawDate}>
            {post.frontmatter.date}
          </time>{" "}
          • Matthew Lehner
        </div>
      </header>
      <div
        itemProp="articleBody"
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  </Layout>
);

Template.propTypes = {
  location: PropTypes.object
};

export default Template;

export const pageQuery = graphql`
  query BlogPostById($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 160)
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        rawDate: date
        path
        title
        description
        cover_image {
          publicURL
          childImageSharp {
            fixed(width: 1076, height: 380) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`;
