import styled from "styled-components";
import { rhythm } from "../styles/typography";
import { maxWidth } from "../utils/presets";

const ArticleWrapper = styled.article`
  display: grid;
  grid-template-columns: 1fr ${rhythm(maxWidth * (3 / 5))} 1fr;
  margin-top: 4rem;
`;

export default ArticleWrapper;
