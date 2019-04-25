import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";

import Helmet from "react-helmet";
import { Link } from "gatsby";
import styled from "styled-components";
import tw from "tailwind.macro";
import Container from "../components/container";
import typography from "../styles/typography";
import presets from "../utils/presets";

import "../layouts/syntax.css";

const { rhythm } = typography;
const { maxWidth } = presets;

const H1 = styled.h1`
  ${tw`flex flex-col justify-center leading-tight tracking-tight font-extrabold text-3xl md:text-5xl md:font-black mx-auto md:mb-16 mb-0`}
  max-width: ${rhythm(maxWidth)};

  @media (min-width: 700px) {
    height: 30vh;
    min-height: 220px;
    max-height: 450px;
    max-width: ${rhythm(maxWidth * (3 / 5))};
  }
`;

const Logo = styled(Link)`
  ${tw`text-base font-extrabold p-1 absolute top-0 left-0`}
`;

const Line = styled.span`
  ${tw`m-0`}
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
