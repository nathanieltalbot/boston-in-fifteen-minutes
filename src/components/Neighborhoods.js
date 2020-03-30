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
            tractsBostonBariLayer(name: {eq: "Tracts_Boston BARI"}) {
                features {
                    geometry {
                        type
                        coordinates
                    }
                    featureFields {
                        ISD_Nbhd
                        CT_ID_10
                    }
                }
            }
        }
        `)
    const dataSet = props.dataSet
    return(
        data.tractsBostonBariLayer.features.map((node) => 
          <GeoJSON data={node.geometry}
          key={node.featureFields.CT_ID_10}
          attribution="BARI" 
          color={props.dataSet[node.featureFields.ISD_Nbhd]} 
          onEachFeature={(feature, layer) => layer.bindPopup(ReactDOMServer.renderToString(<PopupContent ct_id={node.featureFields.CT_ID_10}/>))}/>)
    )
}