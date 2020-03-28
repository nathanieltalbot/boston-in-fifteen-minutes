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
    `gatsby-plugin-mdx`,
    `gatsby-transformer-csv`,

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/content`
      }
    },
    {
     resolve: `gatsby-source-geo`,
      options: {
        path: `./src/assets/shapes/Tracts_Boston BARI.shp`,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/assets/data`,
      },
    },
    
  ],
};
