import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GeoJSON } from 'react-leaflet'
import { replaceNA } from '../lib/util'
import ReactDOMServer from 'react-dom/server';

var Rainbow = require('rainbowvis.js');

const PopupContent = (props) => {
    return(<><b>Average Commute Time: </b> {props.commuteTime < 0 ? "Unknown" : props.commuteTime + " min"}</>)
}

function commuteTimeMidpoint(census) {
    // Using Midpoint Coding: https://www.displayr.com/how-to-calculate-an-average-value-from-categorical-data/
    // < 10 -- 5
    // 10-30 -- 20
    // 30-60 -- 45
    // 60-90 -- 75
    // > 90 -- 105
    census = replaceNA(census)
    console.log(census)
    if (census.TotalPop > 0) {
        var midpointMatrix = {
            CommuteLess10: 5,
            Commute1030: 20,
            Commute3060: 45,
            Commute6090: 75,
            CommuteOver90: 105
        }
        //Object.keys(census).map((key) => census[key] === "NA"? census[key] = 0)
        const reducer = (accumulator, key) => accumulator + midpointMatrix[key] * (census[key] * census["TotalPop"]);
        console.log(census)
        let sum = Object.keys(midpointMatrix).reduce(reducer, 0)
        console.log(sum)
        return (sum / parseFloat(census.TotalPop))
    }
    else {
        return -1
    }
    

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
                    Commute1030
                    Commute3060
                    Commute6090
                    CommuteLess10
                    CommuteOver90
                }
            }
        }
        ` );

    var gradient = new Rainbow();
    gradient.setSpectrum('green', 'yellow', 'red')
    gradient.setNumberRange(0, 75)

    return(<>{ data.tractsBostonBariLayer.features.map(( node ) => {
        let census_data = data.allAcs1216TractCsv.nodes.find(( n ) => n.CT_ID_10 == node.featureFields.CT_ID_10 )
        let avgCommute = Math.round(commuteTimeMidpoint(census_data))
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