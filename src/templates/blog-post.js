import React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";

import CoverPhoto from "../components/cover-photo";
import PostContent from "../components/post-content";
import ArticleWrapper from "../components/article-wrapper";

const Header = styled.header`
  grid-column: 2 / 3;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-weight: 900;
  margin-bottom: 0.25rem;
`;

const Meta = styled.div`
  color: #222;
`;

const Template = ({ data: { markdownRemark: post } }) => (
  <ArticleWrapper itemScope="" itemType="http://schema.org/Article">
    <Helmet>
      <title>{`${post.frontmatter.title}`}</title>
      <meta
        name="description"
        content={post.frontmatter.meta_description || post.excerpt}
      />
    </Helmet>

    <CoverPhoto image={post.frontmatter.image} card />
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
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt(pruneLength: 160)
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        rawDate: date
        path
        title
        meta_description
        image {
          publicURL
          childImageSharp {
            resolutions(width: 1076, height: 380) {
              ...GatsbyImageSharpResolutions
            }
          }
        }
      }
    }
  }
`;
