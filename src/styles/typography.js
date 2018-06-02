import Typography from "typography";
import {
  codeBg,
  baseBorder,
  baseBorderRadius,
  baseColor,
  headerColor
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
  bodyFontFamily: systemStack,
  headerColor,
  bodyColor: baseColor,
  blockMarginBottom: 1,
  scaleRatio: 2.4,
  overrideStyles: () => ({
    ":not(pre) > code": {
      background: codeBg,
      border: baseBorder,
      borderRadius: baseBorderRadius,
      padding: "2px",
      whiteSpace: "nowrap"
    }
  })
});

export default typography;
