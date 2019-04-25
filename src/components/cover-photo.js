import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import tw from "tailwind.macro";
import Img from "gatsby-image";

const Figure = styled.figure``;

const StyledGatsbyImg = styled(Img)`
  ${tw`m-0 max-w-full align-middle`}
`;

const StyledImg = styled.img`
  ${tw`m-0 max-w-full align-middle object-cover w-full`}
  max-height: 22rem;
`;

const CoverPhoto = ({ image }) => {
  if (image && image.childImageSharp && image.childImageSharp.fixed) {
    return (
      <Figure>
        <StyledGatsbyImg resolutions={image.childImageSharp.fixed} />
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
