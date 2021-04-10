import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";

import { Helmet } from "react-helmet";
import { Link } from "gatsby";

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
        <div className="p-4 mx-auto max-w-5xl space-y-10 mb-32">
          <Helmet
            title={title}
            meta={[{ name: "description", content: description }]}
            bodyAttributes={{
              class:
                "dark:bg-gray-900 dark:text-gray-200 text-gray-700 transition duration-150 ease-out"
            }}
          />
          <header className="max-w-prose mx-auto">
            {isIndex ? (
              <h1 className="mx-auto text-5xl font-semibold leading-7 text-gray-700 dark:text-gray-300">
                Matthew Lehner
              </h1>
            ) : (
              <Link className="text-base dark:text-gray-400 text-sm" to="/">
                ← Back to all posts
              </Link>
            )}
          </header>
          <main>{children}</main>
        </div>
      )}
    />
  );
}

TemplateWrapper.propTypes = {
  location: PropTypes.object.isRequired
};
