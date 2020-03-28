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

    function getDataSet(dataSet) {
        if (dataSet == "neighborhoods") {
            
            const rv = {}
            data.allGeoFeature.edges.map((item) => rv[item.node.featureFields.CT_ID_10] = neighborhoodMapping[item.node.featureFields.ISD_Nbhd])
            return rv
        }
    }

    return(
        <>
        <Map style={{'display': 'flex', 'align-self':'center'}}{...mapSettings}>
            <Marker ref={markerRef} position={CENTER} />
            <Neighborhoods dataSet={getDataSet(props.dataSet)} />
            
        </Map>
        </>
    )
}