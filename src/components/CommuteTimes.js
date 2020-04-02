import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GeoJSON } from 'react-leaflet'
import { replaceNA } from '../lib/util'
import ReactDOMServer from 'react-dom/server';

var Rainbow = require('rainbowvis.js');

const PopupContent = (props) => {
    return(<><b>Average Commute Time: </b> {props.commuteTime < 0 ? "Unknown" : props.commuteTime + " min"}</>)
}

export default function CommuteTimes(props) {
     const data = useStaticQuery( graphql`
        query CommuteQuery {
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
            allAcs1216TractCsv {
                nodes {
                    TotalPop
                    CT_ID_10
                    fields {
                        averageCommute
                    }
                }
            }
        }
        ` );

    var gradient = new Rainbow();
    gradient.setSpectrum('green', 'yellow', 'red')
    gradient.setNumberRange(10, 75)

    return(<>{ data.tractsBostonBariLayer.features.map(( node ) => {
        let census_data = data.allAcs1216TractCsv.nodes.find(( n ) => n.CT_ID_10 == node.featureFields.CT_ID_10 )
        let avgCommute = Math.round(census_data.fields.averageCommute)
        return (<GeoJSON data={node.geometry}
          key={node.featureFields.CT_ID_10}
          attribution="BARI" 
          color={"#" + gradient.colourAt(avgCommute)}
          onEachFeature={( feature, layer ) => layer.bindPopup( ReactDOMServer.renderToString(
            <PopupContent 
              commuteTime={avgCommute}
            />
          ))}
          />)}
      ) }</>)
}