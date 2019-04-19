import { graphql } from "gatsby";
import React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";

import typography from "../styles/typography";
import CoverPhoto from "../components/cover-photo";
import PostContent from "../components/post-content";
import ArticleWrapper from "../components/article-wrapper";

const { rhythm, options } = typography;

const Header = styled.header`
  margin-bottom: ${rhythm(options.blockMarginBottom)};

  @media (min-width: 700px) {
    margin-bottom: ${rhythm(options.blockMarginBottom * 2)};
  }
`;

const Title = styled.h1`
  font-weight: 900;
  margin-bottom: 0.25rem;
  letter-spacing: -0.75px;

  @media (max-width: 699px) {
    font-size: 2rem;
  }
`;

const Meta = styled.div`
  color: rgba(0, 0, 0, 0.64);
  font-size: 0.8rem;
`;

const Template = ({ data: { markdownRemark: post } }) => (
  <ArticleWrapper itemScope="" itemType="http://schema.org/Article">
    <Helmet>
      <title>{`${post.frontmatter.title}`}</title>
      <meta
        name="description"
        content={post.frontmatter.description || post.excerpt}
      />
    </Helmet>
    <CoverPhoto image={post.frontmatter.cover_image} card />
    <Header>
      <Title itemProp="headline">{post.frontmatter.title}</Title>
      <Meta>
        Matthew Lehner –{" "}
        <time dateTime={post.frontmatter.rawDate}>{post.frontmatter.date}</time>
      </Meta>
    </Header>
    <PostContent
      itemProp="articleBody"
      dangerouslySetInnerHTML={{ __html: post.html }}
    />
  </ArticleWrapper>
);

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
