import styled from "styled-components";
import { rhythm, options } from "../styles/typography";
import { maxWidth } from "../utils/presets";

const ArticleWrapper = styled.article`
  margin-left: auto;
  margin-right: auto;
  margin-top: ${rhythm(options.blockMarginBottom)};
  max-width: ${rhythm(maxWidth * (3 / 5))};

  @media (min-width: 700px) {
    margin-top: 4rem;
  }
`;

export default ArticleWrapper;
