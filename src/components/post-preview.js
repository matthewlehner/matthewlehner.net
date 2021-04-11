import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

export default class PostPreview extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  };

  render() {
    const { post } = this.props;
    return (
      <section className="pt-12">
        <h2 className="my-0">{post.frontmatter.title}</h2>
        <time
          className="text-xs text-gray-700 dark:text-gray-400 mt-1 mb-4 block"
          dateTime={post.frontmatter.rawDate}
        >
          {post.frontmatter.date}
        </time>
        <p className="text">{post.frontmatter.description || post.excerpt}</p>
        <Link
          className="dark:hover:border-gray-500 border dark:border-gray-800 border-gray-200 hover:border-gray-400 px-2 py-1 inline-block rounded transition-colors ease-in-out text-sm font-medium hover:no-underline"
          to={`/${post.frontmatter.path}`}
        >
          Read More →
        </Link>
      </section>
    );
  }
}
