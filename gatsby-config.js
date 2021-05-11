module.exports = {
  siteMetadata: {
    title: `Bobby Writing Blogs`,
    description: `小狐的个人博客，技术杂谈`,
    author: `@bobby`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {
        analyzerMode: 'server',
        analyzerPort: 3001,
        devMode: true,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `columns`,
        path: `${__dirname}/columns`
      }
    },
    `gatsby-plugin-preact`,
    {
      resolve: `gatsby-plugin-zopfli`,
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/fox.jpg`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-gatsby-cloud`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-sass`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
