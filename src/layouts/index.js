import React, { Fragment } from "react";
import Helmet from "react-helmet";
import Link from "gatsby-link";
import styled from "styled-components";
import Container from "../components/container";
import { rhythm } from "../styles/typography";
import { maxWidth } from "../utils/presets";

import "./syntax.css";

import { actionColor } from "../styles/variables";

const H1 = styled.h1`
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
  letter-spacing: -1.5px;
  font-size: 2.4rem;

  margin-left: auto;
  margin-right: auto;
  margin-bottom: 4rem;
  max-width: ${rhythm(maxWidth)};

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
  font-size: 1rem;

  color: rgba(0, 0, 0, 0.44);
  transition: color 100ms linear;

  &:hover {
    color: ${actionColor};
  }

  @media (min-width: 700px) {
    font-size: 2rem;
  }
`;

const Line = styled.span`
  margin: 0;
`;

export default function TemplateWrapper({ data, children, location }) {
  const {
    site: {
      siteMetadata: { title, description }
    }
  } = data;
  const isIndex = location.pathname === "/";

  return (
    <Container>
      <Helmet
        title={title}
        meta={[{ name: "description", content: description }]}
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
          <Logo to="/">MPL</Logo>
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
        description
      }
    }
  }
`;
