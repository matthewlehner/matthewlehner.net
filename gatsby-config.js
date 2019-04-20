const netlifyCMSPaths = {
  resolve: "gatsby-plugin-netlify-cms-paths",
  options: {
    cmsConfig: "/static/admin/config.yml"
  }
};

module.exports = {
  siteMetadata: {
    title: "Matthew Lehner writes, sometimes",
    description:
      "Matthew Lehner writes about software and working in the industry.",
    siteUrl: "https://matthewlehner.net"
  },
  plugins: [
    netlifyCMSPaths,
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/assets`,
        name: "uploads"
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/content/blog`,
        name: "pages"
      }
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          netlifyCMSPaths,
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 640,
              backgroundColor: `#ffffff`
            }
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-autolink-headers",
          "gatsby-remark-smartypants"
        ]
      }
    },
    "gatsby-plugin-styled-components",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-feed",
      options: {
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.description || edge.node.excerpt,
                  url: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                  guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                  custom_elements: [
                    {
                      "content:encoded": {
                        _cdata: edge.node.html
                      }
                    }
                  ]
                });
              });
            },
            query: `
             {
               allMarkdownRemark(
                 sort: { order: DESC, fields: [frontmatter___date]},
                 filter: { frontmatter: { draft: { ne: true } } }
               ) {
                 edges {
                   node {
                     excerpt
                     html
                     frontmatter {
                       title
                       date
                       path
                       description
                     }
                   }
                 }
               }
             }
            `,
            output: "/rss.xml"
          }
        ]
      }
    },
    {
      resolve: "gatsby-plugin-typography",
      options: {
        omitGoogleFont: true,
        pathToConfigModule: "src/styles/typography"
      }
    },
    "gatsby-plugin-netlify-cms"
  ]
};
