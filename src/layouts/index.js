import React, { Fragment } from "react";
import Helmet from "react-helmet";
import styled from "styled-components";
import Container from "../components/container";

import "./syntax.css";
// import "../styles/global.js";

const Main = styled.main``;

const Header = styled.header`
  display: flex;
  align-items: center;

  @media (min-width: 700px) {
    height: 80vh;
    max-height: 476px;
  }
`;

const H1 = Container.withComponent("h1").extend`
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.2;
  @media (min-width: 700px) {
  font-size: 5rem;
  }
`;

const Line = styled.span`
  display: block;
  margin: 0;
`;

export default function TemplateWrapper({ data, children }) {
  const { site: { siteMetadata: { title } } } = data;

  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[{ name: "description", content: "Sample" }]}
      />
      <Header>
        <H1>
          <Line>Matthew Lehner</Line>
          <Line>writes about software…</Line>
          <Line>sometimes</Line>
        </H1>
      </Header>
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
