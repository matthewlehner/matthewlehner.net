import { graphql } from "gatsby";
import React from "react";

import PostPreview from "../components/post-preview";
import Wrapper from "../components/article-wrapper";
import Layout from "../components/layout";

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges: posts }
  },
  location
}) => (
  <Layout location={location}>
    <Wrapper>
      {posts.map(({ node: post }) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </Wrapper>
  </Layout>
);

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
