import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import Link from "gatsby-link";
import styled from "styled-components";
import Container from "../components/container";
import { rhythm } from "../styles/typography";
import { maxWidth } from "../utils/presets";

import "./syntax.css";

const H1 = styled.h1`
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
  letter-spacing: -1.5px;
  font-size: ${rhythm(1.2)};
  font-weight: 800;

  margin-left: auto;
  margin-right: auto;
  margin-bottom: 4rem;
  max-width: ${rhythm(maxWidth)};

  @media (min-width: 700px) {
    font-size: ${rhythm(2)};
    font-weight: 900;
    height: 30vh;
    min-height: 220px;
    max-height: 450px;
    margin-bottom: 0;
    max-width: ${rhythm(maxWidth * (3 / 5))};
  }
`;

const Logo = styled(Link)`
  text-decoration: none;
  font-size: 1rem;
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
      <header>
        {isIndex ? (
          <H1>
            <Line>Matthew Lehner</Line>
            <Line>writes about software…</Line>
            {isIndex ? <Line>sometimes</Line> : null}
          </H1>
        ) : (
          <Logo to="/">← Back</Logo>
        )}
      </header>
      <main>{children()}</main>
    </Container>
  );
}

TemplateWrapper.propTypes = {
  location: PropTypes.object.isRequired
};

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
