import React from 'react'
import { Marker, GeoJSON } from 'react-leaflet';
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
    const data = props.data
    return(
        data.allGeoFeature.edges.map((edge) => 
          <GeoJSON data={edge.node.geometry}
          key={edge.node.featureFields.CT_ID_10}
          attribution="BARI" 
          color={commuteToColor(data.allAcs1216TractCsv.edges.find((i) => i.node.CT_ID_10 == edge.node.featureFields.CT_ID_10))} 
          onEachFeature={(feature, layer) => layer.bindPopup(ReactDOMServer.renderToString(<PopupContent ct_id={edge.node.featureFields.CT_ID_10}/>))}/>)
    )
}