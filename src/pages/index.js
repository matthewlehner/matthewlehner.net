import { graphql } from "gatsby";
import React from "react";
import PropTypes from "prop-types";

import PostPreview from "../components/post-preview";
import Layout from "../components/layout";

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges: posts }
  },
  location
}) => (
  <Layout location={location}>
    <article className="max-w-prose space-y-12 divide-y divide-gray-200 dark:divide-gray-600 mx-auto">
      {posts.map(({ node: post }) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </article>
  </Layout>
);

IndexPage.propTypes = {
  location: PropTypes.object
};

export default IndexPage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { tags: { ne: "draft" }, title: { ne: "" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 160)
          id
          frontmatter {
            title
            date(formatString: "MMMM D, YYYY")
            rawDate: date
            path
            description
          }
        }
      }
    }
  }
`;
