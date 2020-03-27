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
    'gatsby-plugin-react-leaflet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`
      }
    },
    
    {
     resolve: `gatsby-source-geo`,
      options: {
        path: `./src/assets/shapes/Tracts_Boston BARI.shp`,
      }
    },
  ]
};
