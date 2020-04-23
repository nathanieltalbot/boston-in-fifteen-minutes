const path = require(`path`)

module.exports = {
  siteMetadata: {
    title: 'Boston, in Fifteen Minutes',
    author: 'Nat Talbot',
    description: "Analyzing Boston's urban design, census tract by census tract.",
  },
  plugins: [
    'gatsby-plugin-resolve-src',
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-react-leaflet',
    `gatsby-plugin-mdx`,
    `gatsby-transformer-csv`,
    `gatsby-transformer-json`,
    `gatsby-transformer-sharp`, 
    `gatsby-plugin-sharp`,

    /*{
        resolve: `gatsby-source-places-api`,
        options: { query: "grocery stores or supermarkets"},
    },*/
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `assets`, `images`),
      },
    },
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
        path: `./src/assets/shapes/BARI/Tracts_Boston BARI.shp`,
      }
    },
    
    {
      resolve: `gatsby-source-geo`,
      options: {
        path: `./src/assets/shapes/Open_Space.geojson`,
      }
    },

    {
    resolve: `gatsby-source-geo`,
      options: {
        path: `./src/assets/shapes/CHCSPT.geojson`,
      }
    },

    {
    resolve: `gatsby-source-geo`,
      options: {
        path: `./src/assets/shapes/acuteCare.geojson`,
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
