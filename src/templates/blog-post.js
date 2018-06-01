import React, { Fragment } from "react";
import Helmet from "react-helmet";
import styled from "styled-components";

import CoverPhoto from "../components/cover-photo";
import PostContent from "../components/post-content";
import ArticleWrapper from "../components/article-wrapper";

const PostTitle = styled.h1`
  margin-bottom: 0;
  font-weight: 900;
`;

const MetaArea = styled.div`
  color: #222;
`;

const MetaAuthor = styled.div`
  display: inline-block;

  &:after {
    content: "–";
    opacity: 0.6;
    margin: 0 0.5rem;
  }
`;

export default function Template({ data: { markdownRemark: post } }) {
  return (
    <Fragment>
      <Helmet>
        <title>{`${post.frontmatter.title}`}</title>
        <meta
          name="description"
          content={post.frontmatter.meta_description || post.excerpt}
        />
      </Helmet>
      <ArticleWrapper itemScope="" itemType="http://schema.org/Article">
        <CoverPhoto image={post.frontmatter.image} card />
        <PostContent>
          <header>
            <PostTitle itemProp="headline">{post.frontmatter.title}</PostTitle>
            <MetaArea>
              <MetaAuthor>Matthew Lehner</MetaAuthor>
              <time dateTime={post.frontmatter.rawDate}>
                {post.frontmatter.date}
              </time>
            </MetaArea>
          </header>
          <div
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </PostContent>
      </ArticleWrapper>
    </Fragment>
  );
}

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
            resolutions(width: 960, height: 336) {
              ...GatsbyImageSharpResolutions
            }
          }
        }
      }
    }
  }
`;
