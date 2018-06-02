import React from "react";
import Link from "gatsby-link";
import styled from "styled-components";

import PostContent from "./post-content";
// import CoverPhoto from "./cover-photo";
import Time from "./blog-time";
import { baseColor } from "../styles/variables";

const H2 = styled.h2`
  font-weight: 900;
  margin-top: 1rem;
`;

const PostPreviewContainer = PostContent.extend`
  width: 38rem;
  margin-top: 2rem;
`;

const PostPreviewBody = styled.section`
  padding: 0 1rem 1rem;
  color: ${baseColor};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const PostPreviewExcerpt = styled.p`
  margin-bottom: 0;
`;

const StyledLink = styled(Link)`
  color: #E45E5F;
`;

export default function PostPreview({ post }) {
  return (
    <PostPreviewContainer>
      {/* <CoverPhoto image={post.frontmatter.image} card /> */}
      <PostPreviewBody>
        <H2>
          <StyledLink to={post.frontmatter.path}>
            {post.frontmatter.title}
          </StyledLink>
        </H2>
        <Time datetime={post.frontmatter.rawDate}>{post.frontmatter.date}</Time>
        <PostPreviewExcerpt>
          {post.frontmatter.meta_description || post.excerpt}
        </PostPreviewExcerpt>
      </PostPreviewBody>
    </PostPreviewContainer>
  );
}
