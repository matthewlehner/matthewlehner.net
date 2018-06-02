import React, { Fragment } from "react";
import styled from "styled-components";

import PostPreview from "../components/post-preview";

const BlogPosts = styled.div`
  padding-top: 4rem;
`;

const IndexPage = ({ data: { allMarkdownRemark: { edges: posts } } }) => (
  <Fragment>
    <BlogPosts>
      {posts
        .filter(post => post.node.frontmatter.title.length > 0)
        .map(({ node: post }) => {
          return <PostPreview key={post.id} post={post} />;
        })}
    </BlogPosts>
  </Fragment>
);

export default IndexPage;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { tags: { ne: "draft" } } }
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
            meta_description
            image {
              publicURL
              ext
              childImageSharp {
                sizes(maxWidth: 606) {
                  ...GatsbyImageSharpSizes
                }
              }
            }
          }
        }
      }
    }
  }
`;
