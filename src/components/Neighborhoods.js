import React from 'react'
import { GeoJSON } from 'react-leaflet';
import { useStaticQuery, graphql } from 'gatsby'
import ReactDOMServer from "react-dom/server";
import { neighborhoodColors } from '../data/settings.js'
import { Container, Row, Col } from 'react-bootstrap'
import Control from 'react-leaflet-control'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

// Simple example of rendering a React component to a popup
const PopupContent = (props) => {

    // Currency formatting example courtesy of: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return(
        <Container>
            <Row>
            <b>Neighborhood: </b>{props.nbhd}
            </Row>
            <Row>
            <b>Census Tract ID: </b>{props.ct_id}
            </Row>
            <Row>
            <b>Population: </b>{props.census.TotalPop}
            </Row>
            <Row>
                {//Checks to ensure that MedHouseIncome is defined
                props.census.MedHouseIncome != "NA" &&
                    <>
                        <b>Median Household Income: </b>{formatter.format(props.census.MedHouseIncome)}
                    </>
                }
            </Row>
            <Row>
                {//Checks to ensure that MedHouseIncome is defined
                props.census.MedHomeVal != "NA" &&
                    <>
                        <b>Median Home Value: </b>{formatter.format(props.census.MedHomeVal)}
                    </>
                }
            </Row>
            <Row>
                {//Checks to ensure that MedHouseIncome is defined
                props.census.MedGrossRent != "NA" &&
                    <>
                        <b>Median Gross Rent: </b>{formatter.format(props.census.MedGrossRent)}
                    </>
                }
            </Row>
        </Container>
    )
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
            allAcs1216TractCsv {
                nodes {
                    CT_ID_10
                    TotalPop
                    MedHouseIncome
                    MedHomeVal
                    MedGrossRent
                }
            }
        }
        `)
    //TODO -- implement 
    return(
        <>
        {data.tractsBostonBariLayer.features.map((node) => 
          <GeoJSON data={node.geometry}
          key={node.featureFields.CT_ID_10}
          attribution="BARI" 
          color={neighborhoodColors[node.featureFields.ISD_Nbhd]} 
          onEachFeature={(feature, layer) => layer.bindPopup(ReactDOMServer.renderToString(
            <PopupContent 
                nbhd={node.featureFields.ISD_Nbhd} 
                ct_id={node.featureFields.CT_ID_10}
                census={data.allAcs1216TractCsv.nodes.find((n) => n.CT_ID_10 == node.featureFields.CT_ID_10)}
            />
            ))}/>
            )}
        <Control position='bottomleft' style={{backgroundColor: 'white'}}>
            <Container fluid style={{backgroundColor:"rgba(255,255,255,.75)"}}>
                {Object.keys(neighborhoodColors).map((nbhd) =>
                <Row>
                    <Col xl>{nbhd}</Col>
                        <Col xs><FontAwesomeIcon icon={faCircle} color={neighborhoodColors[nbhd]} /></Col>
                </Row>
                )}
                
            </Container>
        </Control>
        </>
    )
}