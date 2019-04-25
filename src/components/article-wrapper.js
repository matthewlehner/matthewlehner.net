import styled from "styled-components";
import tw from "tailwind.macro";
import typography from "../styles/typography";
import presets from "../utils/presets";

const { rhythm } = typography;
const { maxWidth } = presets;

const ArticleWrapper = styled.article`
  ${tw`mx-auto mt-6`}
  max-width: ${rhythm(maxWidth * (3 / 5))};
`;

export default ArticleWrapper;
