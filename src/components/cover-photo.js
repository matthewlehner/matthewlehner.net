import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Img from "gatsby-image";

const Figure = styled.figure`
  grid-column: 1 / 5;
  margin: 0 0 2rem 0;
`;

const StyledGatsbyImg = styled(Img)`
  margin: 0;
  max-width: 100%;
  vertical-align: middle;
`;

const StyledImg = styled.img`
  margin: 0;
  max-width: 100%;
  vertical-align: middle;
  object-fit: cover;
  max-height: 22rem;
  width: 100%;
`;

const CoverPhoto = ({ image }) => {
  if (image && image.childImageSharp && image.childImageSharp.resolutions) {
    return (
      <Figure>
        <StyledGatsbyImg resolutions={image.childImageSharp.resolutions} />
      </Figure>
    );
  } else if (image && image.publicURL) {
    return (
      <Figure>
        <StyledImg src={image.publicURL} />
      </Figure>
    );
  }

  return null;
};

CoverPhoto.propTypes = {
  image: PropTypes.object
};

export default CoverPhoto;
