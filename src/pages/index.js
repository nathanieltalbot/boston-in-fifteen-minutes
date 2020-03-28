
import React from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import { Container } from 'react-bootstrap';
import MapData from 'components/MapData'
import 'bootstrap/dist/css/bootstrap.min.css';

import { useStaticQuery, graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
/**
  * randColorStyle
  * @description A function that returns a random hex color as a string
  */
function randColorStyle(){
  return {color: '#'+Math.floor(Math.random()*16777215).toString(16)}
}

const IndexPage = () => {
  const data = useStaticQuery(graphql`
          query MdxQuery {
            mdx(frontmatter: {title: {eq: "Home"}}) {
              body
            }
          }`)
  
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  const neighborhoodMapping = {
    "Beacon Hill": '#B89C30',
    "Mission Hill": '#B84230',
    "Fenway/Kenmore": '#0000FF',
    "Allston/Brighton": '#800000',
    "East Boston": '#008080',
    "South Boston": '#000080',
    "West End": '#FF00FF',
    "South End": '#FFFF00',
    "Charlestown": '#4B0082',
    "North End": '#BC8F8F',
    "Government Center/Faneuil Hall": '#778899',
    "Roxbury": '#F08080',
    "Chinatown": '#5F9EA0',
    "Financial District/Downtown": '#BC8F8F',
    "Bay Village": '#B22222',
    "Dorchester": '#5c5c5c',
    "Jamaica Plain": '#8B4513',
    "West Roxbury": '#7B68EE',
    "Hyde Park": '#00FF00',
    "Roslindale": '#00FFFF',
    "Mattapan": '#006400'

  }



  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Container style={{'display': 'flex', 'align-items':'center', 'flex-direction':'column'}}>
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
      
      </Container>
    </Layout>
  );
};

export default IndexPage;