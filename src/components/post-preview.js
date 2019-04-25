import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import styled from "styled-components";
import tw from "tailwind.macro";

import { baseColor } from "../styles/variables";

const H2 = styled.h2`
  ${tw`font-black mx-0 my-2`}
  letter-spacing: -0.0125em;
`;

const PostPreviewContainer = styled.div`
  ${tw`mb-12`}
  grid-column: 2 / 3;
`;

const PostPreviewBody = styled.section`
  color: ${baseColor};
`;

const PostPreviewExcerpt = styled.p`
  ${tw`mb-0`}
`;

const PreviewFooter = styled.div`
  ${tw`text-xs mt-2 text-gray-700`}
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
            <Link to={`/${post.frontmatter.path}`}>
              {post.frontmatter.title}
            </Link>
          </H2>
          <PostPreviewExcerpt>
            {post.frontmatter.description || post.excerpt}
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
