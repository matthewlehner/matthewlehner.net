import React from "react";
import Helmet from "react-helmet";
import Link from "gatsby-link";
import styled from "styled-components";
import Container from "../components/container";

import "./syntax.css";

const H1 = styled.h1`
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
  letter-spacing: -1.5px;
  font-size: 2.4rem;

  margin-bottom: 4rem;

  @media (min-width: 700px) {
    font-weight: 900;
    font-size: 5rem;
    height: 80vh;
    max-height: 476px;
    margin-bottom: 0;
  }
`;

const Logo = styled(Link)`
  font-weight: 900;
  letter-spacing: -0.5px;
  text-decoration: none;
  font-size: 2rem;

  color: #4A4A4A;
`;

const Line = styled.span`
  margin: 0;
`;

export default function TemplateWrapper({ data, children, location }) {
  const { site: { siteMetadata: { title } } } = data;
  const isIndex = location.pathname === "/";

  return (
    <Container>
      <Helmet
        title={title}
        meta={[{ name: "description", content: "Sample" }]}
      />
      {isIndex ? (
        <header>
          <H1>
            <Line>Matthew Lehner</Line>
            <Line>writes about software…</Line>
            {isIndex ? <Line>sometimes</Line> : null}
          </H1>
        </header>
      ) : (
        <header>
          <Logo to="/">MPL writes…</Logo>
        </header>
      )}
      <main>{children()}</main>
    </Container>
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
