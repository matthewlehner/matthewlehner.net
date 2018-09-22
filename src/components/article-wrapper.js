import styled from "styled-components";
import typography from "../styles/typography";
import presets from "../utils/presets";

const { rhythm, options } = typography;
const { maxWidth } = presets;

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
