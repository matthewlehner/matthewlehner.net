import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";

import { Helmet } from "react-helmet";
import { Link } from "gatsby";

import LinkedInLogo from "../../assets/linkedin-logo.svg";
import TwitterLogo from "../../assets/twitter-logo.svg";

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
              <h1 className="mx-auto text-2xl font-semibold text-gray-700 dark:text-gray-300">
                Matthew Lehner writes about software
              </h1>
            ) : (
              <Link
                className="dark:text-gray-400 text-gray-500 hover:text-indigo-700 dark:hover:text-indigo-400 text-sm transition-colors"
                to="/"
              >
                ← Back to all posts
              </Link>
            )}
          </header>
          <main>{children}</main>
          <footer className="border-t border-gray-200 dark:border-gray-800 mt-[1.3888889rem] pt-[1.3888889rem] max-w-prose mx-auto">
            <p>
              MatthewLehner.net • <Link to="/rss.xml">RSS</Link>
            </p>
            <ul className="list-none ml-0">
              <li>
                <Link
                  to="https://www.linkedin.com/in/matthewlehner/"
                  className="inline-flex space-x-2 items-center"
                >
                  <LinkedInLogo className="w-4 h-4 fill-current" />
                  <span>Matthew Lehner</span>
                </Link>
              </li>
              <li>
                <Link
                  to="https://twitter.com/matthewpearse"
                  className="inline-flex space-x-2 items-center"
                >
                  <TwitterLogo className="w-4 h-4 fill-current" />
                  <span>@matthewpearse</span>
                </Link>
              </li>
            </ul>
            <p className="text-xs">© 2021 Matthew Lehner</p>
          </footer>
        </div>
      )}
    />
  );
}

TemplateWrapper.propTypes = {
  location: PropTypes.object.isRequired
};
