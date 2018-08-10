import React from "react";

import PostPreview from "../components/post-preview";
import Wrapper from "../components/article-wrapper";

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges: posts }
  }
}) => (
  <Wrapper>
    {posts.map(({ node: post }) => (
      <PostPreview key={post.id} post={post} />
    ))}
  </Wrapper>
);

export default IndexPage;

export const pageQuery = graphql`
  query IndexQuery {
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
