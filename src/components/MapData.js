import React, { useRef }  from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Map from 'components/Map';
import Neighborhoods from 'components/Neighborhoods'
import { Marker } from 'react-leaflet';

// Global variables that define where the map should start
const LOCATION = {
  lat: 42.340260,
  lng: -71.089109
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 11;


export default function MapData(props) {

  const markerRef = useRef();

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
                    CT_ID_10
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
            allAcs1216TractCsv {
            edges {
                node {
                CT_ID_10
                Commute1030
                }
            }
            }
        }
        `)

    return(
        <Map style={{'display': 'flex', 'align-self':'center'}}{...mapSettings}>
            <Marker ref={markerRef} position={CENTER} />
            <Neighborhoods data={data} />
        </Map>
    )
}