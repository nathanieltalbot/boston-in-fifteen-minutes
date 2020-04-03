import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GeoJSON } from 'react-leaflet'
import { replaceNA } from '../lib/util'
import ReactDOMServer from 'react-dom/server';
import { Container, Row, Col } from 'react-bootstrap'
import Control from 'react-leaflet-control';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

var Rainbow = require('rainbowvis.js');

const PopupContent = (props) => {
    //const census = props.census
    return(
        <Container>
            <Row><b>By Auto: </b> {(parseFloat(props.census.ByAuto)* 100).toFixed(2)}%</Row>
            <Row><b>By Public Transit: </b> {(parseFloat(props.census.ByPubTrans)* 100).toFixed(2)}%</Row>
            <Row><b>By Bike: </b> {(parseFloat(props.census.ByBike)* 100).toFixed(2)}%</Row>
            <Row><b>By Walking: </b> {(parseFloat(props.census.ByWalk)* 100).toFixed(2)}%</Row>
        </Container>
        )
}

const colorMap = {
    "ByAuto": "#650D1B",
    "ByBike": "#006E90", 
    "ByPubTrans": "#F18805", 
    "ByWalk": "#87FF65"
}

// TODO -- find a nicer way to write this
function commuteTypeToColor(census) {
    var max = 0
    var largest = ""
    census = replaceNA(census)
    //const types = ["ByAuto", "ByBike", "ByPubTrans", "ByWalk"]
    console.log(census.CT_ID_10)
    Object.keys(colorMap).forEach(element => {
        console.log(element)
        //console.log(max)
        if (parseFloat(census[element]) > max) {
            console.log(`${element} at ${census[element]} is larger than ${largest} at ${max}`)
            max = census[element]
            largest = element
            
        }
    });
    if (largest.length > 0) {
        console.log(largest)
        console.log(colorMap[largest])
        return colorMap[largest]
    }
    else {
        return "#808080" 
    } 
}

export default function CommuteTypes(props) {
     const data = useStaticQuery( graphql`
        query CommuteTypeQuery {
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
                    ByAuto
                    ByBike
                    ByPubTrans
                    ByWalk
                }
            }
        }
        ` );

    var gradient = new Rainbow();
    gradient.setSpectrum('green', 'yellow', 'red')
    gradient.setNumberRange(10, 75)

    return(
        <>
            { data.tractsBostonBariLayer.features.map(( node ) => {
                let census_data = data.allAcs1216TractCsv.nodes.find(( n ) => n.CT_ID_10 == node.featureFields.CT_ID_10 )
                //let avgCommute = Math.round(commuteTimeMidpoint(census_data))
                return (
                    <GeoJSON data={node.geometry}
                        key={node.featureFields.CT_ID_10}
                        attribution="BARI" 
                        color={commuteTypeToColor(census_data)}
                        onEachFeature={( feature, layer ) => layer.bindPopup( ReactDOMServer.renderToString(
                            <PopupContent 
                            census={census_data}
                            />
                        ))}
                    />)})}
            <Control position='bottomleft' style={{backgroundColor: 'white'}}>
                <Container fluid style={{backgroundColor:'rgba(255,255,255,.75)'}}>
                { Object.keys(colorMap).map(( key ) =>
                    <Row>
                    <Col xl>{ key }</Col>
                    <Col xs><FontAwesomeIcon icon={faCircle} color={colorMap[key]} /></Col>
                    </Row>
                ) }
   
                </Container>
            </Control>
      </>)
}