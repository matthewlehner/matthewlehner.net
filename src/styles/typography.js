import Typography from "typography";
import {
  codeBg,
  baseBorder,
  baseBorderColor,
  baseBorderRadius,
  baseColor,
  headerColor,
  fixedFontFamily,
  actionColor
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
  overrideStyles: ({ rhythm, scale }, options) => ({
    code: {
      fontSize: "inherit",
      fontFamily: fixedFontFamily
    },
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
      fontSize: "0.75rem",
      borderRadius: baseBorderRadius,
      display: "block",
      lineHeight: 1.2,
      outline: "none",
      overflowX: "auto",
      padding: "0.6rem",
      whiteSpace: "inherit"
    },
    blockquote: {
      borderLeft: `8px solid ${baseBorderColor}`,
      marginLeft: 0,
      fontStyle: "italic",
      paddingLeft: "1.45rem"
    },
    h2: {
      marginTop: rhythm(options.blockMarginBottom * 2),
      marginBottom: rhythm(options.blockMarginBottom),
      letterSpacing: "-0.0075em"
    },
    h3: {
      ...scale(2 / 5),
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: "-0.01em",
      marginTop: rhythm(options.blockMarginBottom * 2),
      marginBottom: rhythm(options.blockMarginBottom / 2)
    },
    "a, a code": {
      color: baseColor,
      "-webkitTextDecorationColor": actionColor,
      textDecorationColor: actionColor,
      backgroundColor: "transparent",
      transition: "color 100ms linear, background-color 100ms linear",
      "-webkitTextDecorationSkip": "ink"
      // textDecoration: "none"
    },
    "a:hover, a:hover code": {
      color: "white",
      backgroundColor: actionColor
      // textDecoration: "underline"
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
