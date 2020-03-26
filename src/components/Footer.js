import React from 'react';

import { Container } from 'react-bootstrap';
import { useStaticQuery, graphql } from 'gatsby'

function Footer() {
  const data = useStaticQuery(graphql`
    query FooterQuery {
      site {
        siteMetadata {
          author
        }
      }
    }
  `)
  return (
    <footer>
      <Container fluid>
        <p>&copy; { new Date().getFullYear() }, {data.site.siteMetadata.author}</p>
      </Container>
    </footer>
  );
};

export default Footer;
