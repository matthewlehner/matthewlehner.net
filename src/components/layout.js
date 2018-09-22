import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";

import Helmet from "react-helmet";
import { Link } from "gatsby";
import styled from "styled-components";
import Container from "../components/container";
import typography from "../styles/typography";
import presets from "../utils/presets";

import "../layouts/syntax.css";

const { rhythm } = typography;
const { maxWidth } = presets;

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
  font-size: 1rem;
  font-weight: 800;
  padding: 0.25rem;
  position: absolute;
  left: 0;
  top: 0;
`;

const Line = styled.span`
  margin: 0;
`;

const query = graphql`
  query HeaderQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;

export default function TemplateWrapper({ children, location }) {
  const isIndex = location.pathname === "/";

  return (
    <StaticQuery
      query={query}
      render={({
        site: {
          siteMetadata: { title, description }
        }
      }) => (
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
              // <Logo to="/">← Back</Logo>
              <Logo to="/">ML</Logo>
            )}
          </header>
          <main>{children}</main>
        </Container>
      )}
    />
  );
}

TemplateWrapper.propTypes = {
  location: PropTypes.object.isRequired
};
