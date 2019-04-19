const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const { fmImagesToRelative } = require("gatsby-remark-relative-images");
const _ = require("lodash");

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            id
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const path = `/${node.frontmatter.path}`;
      const { id } = node;
      createPage({
        path,
        component: blogPostTemplate,
        context: {
          id
        } // additional data can be passed via context
      });
    });
  });
};

const fileNodes = [];

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  fileNodes.push(node);

  if (node.internal.type === `MarkdownRemark` || node.internal.type === `Mdx`) {
    if (node.frontmatter.cover_image) {
      let imagePath;

      const foundImageNode = _.find(fileNodes, file => {
        if (!file.dir) return;
        imagePath = path.join(
          file.dir,
          path.basename(node.frontmatter.cover_image)
        );

        return path.normalize(file.absolutePath) === imagePath;
      });
      if (foundImageNode) {
        node.frontmatter.cover_image = path.relative(
          path.join(node.fileAbsolutePath, ".."),
          imagePath
        );
      }
    }
  }

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value
    });
  }

  fmImagesToRelative(node); // convert image paths for gatsby images
};
