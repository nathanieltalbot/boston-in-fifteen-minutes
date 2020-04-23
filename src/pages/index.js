
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
            site {
              siteMetadata {
                title
                description
              }
            }
            imageSharp(fixed: {}, fluid: {originalName: {eq: "link-preview.png"}}) {
              fixed {
                src
              }
            }
          }`)
  
  return (
    <Layout pageName="home">
      <Helmet>
        <meta property="og:title" content={data.site.siteMetadata.title}/>
        <meta property="og:description" content={data.site.siteMetadata.description}/>
        <meta property="og:image" content={"https://boston.nat-talbot.com" + data.imageSharp.fixed.src}/>
      </Helmet>
      <Container style={{'display': 'flex', 'align-items':'center', 'flexDirection':'column'}}>
      <Jumbotron style={{'display': 'flex', 'align-items':'center', 'flexDirection':'column'}}>
        <h1>{data.site.siteMetadata.title}</h1>
        <h4>{data.site.siteMetadata.description}</h4>
        <h5>Nat Talbot, Khoury College of Computer Sciences</h5>
      </Jumbotron>
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
      
      </Container>
    </Layout>
  );
};

export default IndexPage;