import React, { Fragment } from "react";
import Helmet from "react-helmet";
import styled from "styled-components";

import "./index.css";
import "./syntax.css";
import "../styles/global.js";

const Main = styled.main``;

export default function TemplateWrapper({ data, children }) {
  const { site: { siteMetadata: { title } } } = data;

  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[{ name: "description", content: "Sample" }]}
      />
      <Main>{children()}</Main>
    </Fragment>
  );
}

export const query = graphql`
  query HeaderQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
