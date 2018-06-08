import styled from "styled-components";
import { rhythm } from "../styles/typography";
import { maxWidth } from "../utils/presets";

const Container = styled.div`
  margin: 0 auto;
  max-width: ${rhythm(maxWidth)};
  padding-left: 10px;
  padding-right: 10px;
`;

export default Container;
