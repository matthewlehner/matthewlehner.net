import React, { Fragment } from "react";
import Link from "gatsby-link";
import styled from "styled-components";

import PostContent from "../components/post-content";
import CoverPhoto from "../components/cover-photo";
import Container from "../components/container";
import Time from "../components/blog-time";
import { baseColor } from "../styles/variables";

const H1 = Container.withComponent("h1").extend`
  font-size: 5rem;
  font-weight: 1000;
  letter-spacing: -1px;
`;

const H2 = styled.h2`
  margin-top: 1rem;
  margin-bottom: 0;
`;

const Header = styled.header`
  height: 80vh;
  max-height: 476px;
  display: flex;
  align-items: center;
`;

const BlogPosts = styled.div`
  padding-top: 4rem;
`;

const PostCard = PostContent.extend`
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 38rem;
  margin-top: 2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.075);
  border-radius: 2px;
`;

const PostPreviewBody = styled.section`
  padding: 0 1rem 1rem;
  color: ${baseColor};
`;

const PostPreviewExcerpt = styled.p`
  margin-bottom: 0;
`;

const IndexPage = ({ data: { allMarkdownRemark: { edges: posts } } }) => (
  <Fragment>
    <Header>
      <H1>
        Matthew Lehner<br />
        writes about software…<br />
        sometimes
      </H1>
    </Header>
    <BlogPosts>
      {posts
        .filter(post => post.node.frontmatter.title.length > 0)
        .map(({ node: post }) => {
          return (
            <PostCard key={post.id}>
              <Link to={post.frontmatter.path}>
                <CoverPhoto image={post.frontmatter.image} card />
                <PostPreviewBody>
                  <H2>{post.frontmatter.title}</H2>
                  <Time datetime={post.frontmatter.rawDate}>
                    {post.frontmatter.date}
                  </Time>
                  <PostPreviewExcerpt>
                    {post.frontmatter.meta_description || post.excerpt}
                  </PostPreviewExcerpt>
                </PostPreviewBody>
              </Link>
            </PostCard>
          );
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
