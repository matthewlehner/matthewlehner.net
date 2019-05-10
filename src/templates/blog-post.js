import { graphql } from "gatsby";
import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import styled from "styled-components";
import tw from "tailwind.macro";

import Layout from "../components/layout";
import CoverPhoto from "../components/cover-photo";
import PostContent from "../components/post-content";
import ArticleWrapper from "../components/article-wrapper";

const Header = styled.header`
  ${tw`md:mb-12 mb-6`}
`;

const Title = styled.h1`
  ${tw`mb-1 font-black text-3xl md:text-5xl md:leading-tight`}
  letter-spacing: -0.75px;
`;

const Meta = styled.div`
  ${tw`text-xs text-gray-700`}
`;

const Template = ({ data: { markdownRemark: post }, location }) => (
  <Layout location={location}>
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
          <time dateTime={post.frontmatter.rawDate}>
            {post.frontmatter.date}
          </time>
        </Meta>
      </Header>
      <PostContent
        itemProp="articleBody"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </ArticleWrapper>
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
