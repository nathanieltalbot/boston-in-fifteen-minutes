import React from 'react'
import { GeoJSON } from 'react-leaflet';
import { useStaticQuery, graphql } from 'gatsby'
import ReactDOMServer from "react-dom/server";
var Rainbow = require('rainbowvis.js');

const PopupContent = (props) => {
    return(<><b>Number of trees: </b> {props.trees}</>)
}

export default function Trees( props ) {
  const data = useStaticQuery( graphql`
        query TreesQuery {
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
            allTreesCountJson {
                nodes {
                    CT_ID_10
                    tree_num
                }
            }
        }
` );

    var gradient = new Rainbow();
    gradient.setSpectrum('brown', 'green')
    gradient.setNumberRange(100, 2000)
    return(data.tractsBostonBariLayer.features.map((node) => {
        const trees = data.allTreesCountJson.nodes.find(tract => tract.CT_ID_10 === node.featureFields.CT_ID_10).tree_num
        return(
          <GeoJSON data={node.geometry}
          key={node.featureFields.CT_ID_10}
          attribution="BARI" 
          color={"#" + gradient.colourAt(data.allTreesCountJson.nodes.find(tract => tract.CT_ID_10 === node.featureFields.CT_ID_10).tree_num)}
          onEachFeature={( feature, layer ) => layer.bindPopup( ReactDOMServer.renderToString(
            <PopupContent 
              trees={trees}
            />
        ))}/>)}
        )
    )
}
