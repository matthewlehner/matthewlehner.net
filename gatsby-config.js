module.exports = {
  siteMetadata: {
    title: "Matthew Lehner writes, sometimes",
    description:
      "Matthew Lehner writes about software and working in the industry.",
    siteUrl: "https://matthewlehner.net"
  },
  plugins: [
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages"
      }
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
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
    "gatsby-plugin-sharp",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-feed",
      options: {
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description:
                    edge.node.frontmatter.meta_description || edge.node.excerpt,
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
                       meta_description
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
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-41609989-1",
        respectDNT: true,
        anonymize: true
      }
    }
  ]
};
