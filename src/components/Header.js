import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useStaticQuery, graphql } from 'gatsby'

function Header() {
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <Navbar bg="dark" variant="dark">
  <Navbar.Brand>{data.site.siteMetadata.title}</Navbar.Brand>        
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#link">About</Nav.Link>
      </Nav>    
    </Navbar>
  );
};

export default Header;
