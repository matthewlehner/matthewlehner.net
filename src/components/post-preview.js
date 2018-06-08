import React from "react";
import Link from "gatsby-link";
import styled from "styled-components";

import Time from "./blog-time";
import { baseColor } from "../styles/variables";

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
  color: #e45e5f;
  text-decoration: none;
`;

const PreviewFooter = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

export default function PostPreview({ post }) {
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
        <Time datetime={post.frontmatter.rawDate}>{post.frontmatter.date}</Time>
      </PreviewFooter>
    </PostPreviewContainer>
  );
}
