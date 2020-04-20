
import React from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import { Container, Jumbotron, Button } from 'react-bootstrap';
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

  



  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Container style={{'display': 'flex', 'align-items':'center', 'flexDirection':'column'}}>
      <Jumbotron style={{'display': 'flex', 'align-items':'center', 'flexDirection':'column'}}>
        <h1>Boston, In Fifteen Minutes</h1>
        <h4>An analysis of accessibility in Boston.</h4>
        <h5>Presented by Nat Talbot, fourth-year student, Khoury College of Computer Sciences</h5>
      </Jumbotron>
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
      
      </Container>
    </Layout>
  );
};

export default IndexPage;