module.exports = {
  siteMetadata: {
    title: 'Boston in Fifteen Minutes',
    author: 'Nat Talbot',
    description: '',
  },
  plugins: [
    'gatsby-plugin-resolve-src',
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`
      }
    },
    'gatsby-plugin-react-leaflet'
  ]
};
