import React, { useRef } from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import { Marker, GeoJSON } from 'react-leaflet';

import { promiseToFlyTo, getCurrentLocation } from 'lib/map';

import Layout from 'components/Layout';
import { Container } from 'react-bootstrap';
import Map from 'components/Map';

import gatsby_astronaut from 'assets/images/gatsby-astronaut.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useStaticQuery, graphql } from 'gatsby'


const LOCATION = {
  lat: 42.340260,
  lng: -71.089109
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 10;
const ZOOM = 10;

const timeToZoom = 2000;
const timeToOpenPopupAfterZoom = 4000;
const timeToUpdatePopupAfterZoom = timeToOpenPopupAfterZoom + 3000;

const popupContentHello = `<p>Hello 👋</p>`;
const popupContentGatsby = `
  <div class="popup-gatsby">
    <div class="popup-gatsby-image">
      <img class="gatsby-astronaut" src=${gatsby_astronaut} />
    </div>
    <div class="popup-gatsby-content">
      <h1>Gatsby Leaflet Starter</h1>
      <p>Welcome to your new Gatsby site. Now go build something great!</p>
    </div>
  </div>
`;

function randColorStyle(){
  return {color: '#'+Math.floor(Math.random()*16777215).toString(16)}
}

const IndexPage = () => {
  const markerRef = useRef();

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement } = {}) {
    if ( !leafletElement ) return;

    const popup = L.popup({
      maxWidth: 800
    });

    const location = await getCurrentLocation().catch(() => LOCATION );

    const { current = {} } = markerRef || {};
    const { leafletElement: marker } = current;

    marker.setLatLng( location );
    popup.setLatLng( location );
    popup.setContent( popupContentHello );

    setTimeout( async () => {
      await promiseToFlyTo( leafletElement, {
        zoom: ZOOM,
        center: location
      });

      marker.bindPopup( popup );

      setTimeout(() => marker.openPopup(), timeToOpenPopupAfterZoom );
      setTimeout(() => marker.setPopupContent( popupContentGatsby ), timeToUpdatePopupAfterZoom );
    }, timeToZoom );
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    //mapEffect
  };
  const data = useStaticQuery(graphql`
      query MapQuery {
        allGeoFeature {
          edges {
            node {
              layer_name
              featureFields {
                ISD_Nbhd
              }
              geometry {
                type
                coordinates
                envelope {
                  minX
                  minY
                  maxX
                  maxY
                }
              }
      }
    }
        }
      }
    `)

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
    "Dorchester": '#DCDCDC',
    "Jamaica Plain": '#8B4513',
    "West Roxbury": '#7B68EE',
    "Hyde Park": '#00FF00',
    "Roslindale": '#00FFFF',
    "Mattapan": '#006400'

  }
  function colorToNeighborhood(neighborhood) {
    if (neighborhoodMapping.neighborhood) {
      return {color: neighborhoodMapping.neighborhood}
    }
    else {
      return {color: '#000000'}
    }
  }
  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Container style={{'display': 'flex', 'align-items':'center'}}>
        <Map {...mapSettings}>
          <Marker ref={markerRef} position={CENTER} />
          {data.allGeoFeature.edges.map((edge) => 
          <GeoJSON data={edge.node.geometry} style={() => {colorToNeighborhood(edge.node.featureFields.ISD_Nbhd)}}/>)}
          
        </Map>
        
      </Container>
      
    </Layout>
  );
};

export default IndexPage;
