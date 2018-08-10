import React from "react";
import PropTypes from "prop-types";
import Link from "gatsby-link";
import styled from "styled-components";

import { baseColor, actionColor } from "../styles/variables";

const H2 = styled.h2`
  letter-spacing: -0.0125em;
  margin: 0.5rem 0;
  font-weight: 900;
`;

const PostPreviewContainer = styled.div`
  margin-bottom: 3rem;
  grid-column: 2 / 3;
`;

const PostPreviewBody = styled.section`
  color: ${baseColor};
`;

const PostPreviewExcerpt = styled.p`
  margin-bottom: 0;
`;

const StyledLink = styled(Link)`
  color: ${actionColor};
  text-decoration: none;
`;

const PreviewFooter = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: rgba(0, 0, 0, 0.64);
`;

export default class PostPreview extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  };

  render() {
    const { post } = this.props;
    return (
      <PostPreviewContainer>
        <PostPreviewBody>
          <H2>
            <StyledLink to={post.frontmatter.path}>
              {post.frontmatter.title}
            </StyledLink>
          </H2>
          <PostPreviewExcerpt>
            {post.frontmatter.meta_description || post.excerpt}
          </PostPreviewExcerpt>
        </PostPreviewBody>

        <PreviewFooter>
          <time dateTime={post.frontmatter.rawDate}>
            {post.frontmatter.date}
          </time>
        </PreviewFooter>
      </PostPreviewContainer>
    );
  }
}

PostPreview.prop;
