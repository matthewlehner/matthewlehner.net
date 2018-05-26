import React, { Fragment } from "react";
import Helmet from "react-helmet";

import CoverPhoto from "../components/cover-photo";
import PostContent from "../components/post-content";
import ArticleWrapper from "../components/article-wrapper";

const Template = ({ data: { markdownRemark: post } }) => (
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
          <h1 style={{ marginBottom: 0 }} itemProp="headline">
            {post.frontmatter.title}
          </h1>
          <div>
            Matthew Lehner –{" "}
            <time dateTime={post.frontmatter.rawDate}>
              {post.frontmatter.date}
            </time>
          </div>
        </header>
        <div
          itemProp="articleBody"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </PostContent>
    </ArticleWrapper>
  </Fragment>
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
            resolutions(width: 960, height: 336) {
              ...GatsbyImageSharpResolutions
            }
          }
        }
      }
    }
  }
`;
