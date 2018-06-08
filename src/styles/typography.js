import Typography from "typography";
import {
  codeBg,
  baseBorder,
  baseBorderColor,
  baseBorderRadius,
  baseColor,
  headerColor,
  fixedFontFamily
} from "./variables";

const systemStack = [
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Oxygen",
  "Ubuntu",
  "Cantarell",
  "Fira Sans",
  "Droid Sans",
  "Helvetica Neue",
  "sans-serif"
];

const typography = new Typography({
  baseFontSize: "18px",
  bodyFontFamily: systemStack,
  headerColor,
  headerWeight: 900,
  bodyColor: baseColor,
  blockMarginBottom: 1,
  scaleRatio: 3,
  overrideStyles: () => ({
    ":not(pre) > code": {
      background: codeBg,
      border: baseBorder,
      borderRadius: baseBorderRadius,
      padding: "2px",
      whiteSpace: "nowrap"
    },
    pre: {
      background: codeBg,
      border: baseBorder,
      borderRadius: baseBorderRadius,
      lineHeight: 1.2,
      overflowX: "auto",
      whiteSpace: "pre",
      wordWrap: "normal"
    },
    "pre code": {
      borderRadius: baseBorderRadius,
      display: "block",
      fontFamily: fixedFontFamily,
      outline: "none",
      overflowX: "auto",
      padding: "0.8rem 1.1rem",
      whiteSpace: "inherit"
    },
    blockquote: {
      borderLeft: `8px solid ${baseBorderColor}`,
      marginLeft: 0,
      fontStyle: "italic",
      paddingLeft: "1.45rem"
    }

    // ":any-link": {
    //   color: baseColor,
    //   textDecoration: "none",
    //   borderBottom: "1px solid blue",
    //   transition: "color 0.1s linear",
    //
    //   "&:hover": {
    //     color: "blue"
    //   }
    // }
  })
});

export default typography;
