import React from "react";
import PropTypes from "prop-types";
import Img from "gatsby-image";

function StyledGatsbyImg(props) {
  return <Img className="max-w-full m-0 align-middle" {...props} />;
}

function StyledImg(props) {
  return (
    <img
      className="object-cover w-full max-w-full m-0 align-middle max-h-80"
      {...props}
    />
  );
}

const CoverPhoto = ({ image }) => {
  if (image && image.childImageSharp && image.childImageSharp.fixed) {
    return (
      <figure>
        <StyledGatsbyImg fixed={image.childImageSharp.fixed} />
      </figure>
    );
  } else if (image && image.publicURL) {
    return (
      <figure>
        <StyledImg src={image.publicURL} />
      </figure>
    );
  }

  return null;
};

CoverPhoto.propTypes = {
  image: PropTypes.object
};

export default CoverPhoto;
