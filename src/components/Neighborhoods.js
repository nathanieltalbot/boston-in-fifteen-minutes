import React from 'react'
import { GeoJSON } from 'react-leaflet';
import { useStaticQuery, graphql } from 'gatsby'
import ReactDOMServer from "react-dom/server";

function commuteToColor(commute) {
    commute = commute.node.Commute1030
    if (commute < 0.40) {
        return '#F34213'
    }
    else if (commute >= 0.40 && commute < 0.60) {
        return '#FDE74C'
    }
    else {
        return '#3A5743'
    }
}

// Simple example of rendering a React component to a popup
const PopupContent = (props) => {
    return(<p>{props.ct_id} 👋</p>)
}


//Abstracting the GeoJSON configuration to it's own component
//TODO -- abstract the data that is being displayed by these polygons -- pass in a data type with CT_ID and color?
export default function Neighborhoods(props) {
    const data = useStaticQuery(graphql`
        query ShapeQuery {
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
        }
        `)
    const dataSet = props.dataSet
    return(
        data.allGeoFeature.edges.map((edge) => 
          <GeoJSON data={edge.node.geometry}
          key={edge.node.featureFields.CT_ID_10}
          attribution="BARI" 
          color={props.dataSet[edge.node.featureFields.CT_ID_10]} 
          onEachFeature={(feature, layer) => layer.bindPopup(ReactDOMServer.renderToString(<PopupContent ct_id={edge.node.featureFields.CT_ID_10}/>))}/>)
    )
}