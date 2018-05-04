import { injectGlobal } from "styled-components";
import {
  codeBg,
  baseBorder,
  baseBorderRadius,
  fixedFontFamily,
  baseColor,
  headerColor
} from "./variables";

injectGlobal`
  body {
    color: ${baseColor};
  }

  pre {
    background: ${codeBg};
    border: ${baseBorder};
    border-radius: ${baseBorderRadius};
    line-height: 1.2;
    overflow-x: auto;
    white-space: pre;
    word-wrap: normal;

    code {
      border-radius: ${baseBorderRadius};
      display: block;
      font-family: ${fixedFontFamily};
      font-size: 0.875rem;
      outline: none;
      overflow-x: auto;
      padding: 0.8rem 1.1rem;
      white-space: inherit;

    }
  }

  :not(pre) > code {
    background: ${codeBg};
    border: ${baseBorder};
    border-radius: ${baseBorderRadius};
    padding: 2px;
    white-space: nowrap;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${headerColor};
    font-weight: 600;
  }

  :any-link {
    color: ${baseColor};
    text-decoration: none;
    border-bottom: 1px solid blue;
    transition: color 0.1s linear;

    &:hover {
      color: blue;
    }
  }

  .anchor {
    border-bottom: none;
  }
`;
