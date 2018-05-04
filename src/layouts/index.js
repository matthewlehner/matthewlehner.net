import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Link from "gatsby-link";
import Helmet from "react-helmet";
import styled from "styled-components";

import Container from "../components/container";

import "./index.css";
import "./syntax.css";
import "../styles/global.js";

const HeaderWrapper = styled.header``;

const Main = styled.main``;

const HeaderLink = styled(Link)`
  border-bottom: none;
`;

const H1 = styled.h1`
  margin: 0;
`;

const HeaderNav = styled.nav``;

const Header = ({ branding }) => (
  <HeaderWrapper>
    <Container>
      <H1>
        <HeaderLink to="/">{branding}</HeaderLink>
      </H1>
      {/* <HeaderNav> */}
      {/*   <HeaderLink to="#">Home</HeaderLink> */}
      {/*   <HeaderLink to="#">About</HeaderLink> */}
      {/* </HeaderNav> */}
    </Container>
  </HeaderWrapper>
);

const TemplateWrapper = ({ data, children, location }) => {
  const { site: { siteMetadata: { title } } } = data;
  const isHomepage = location.pathname == "/";

  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[{ name: "description", content: "Sample" }]}
      />
      {isHomepage ? null : <Header branding={title} />}
      <Main>{children()}</Main>
    </Fragment>
  );
};

TemplateWrapper.propTypes = {
  children: PropTypes.func
};

export default TemplateWrapper;

export const query = graphql`
  query HeaderQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
