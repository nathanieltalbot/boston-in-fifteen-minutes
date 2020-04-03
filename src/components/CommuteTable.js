import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { Container, Table } from 'react-bootstrap'
var Rainbow = require('rainbowvis.js');

function fuckingInnerJoin(data) {
    var reducer = (acc, curr) => {
        ///console.log(data.allAcs1216TractCsv)
        //console.log(curr)
        let census = data.allAcs1216TractCsv.nodes.find(( n ) => n.CT_ID_10 == curr.featureFields.CT_ID_10)
        acc.push({
            "CT_ID_10": curr.featureFields.CT_ID_10, 
            ISD_Nbhd: curr.featureFields.ISD_Nbhd, 
            "TotalPop": census.TotalPop, 
            "averageCommute": census.fields.averageCommute,
            "ByAuto": census.ByAuto,
            "ByBike": census.ByBike,
            "ByPubTrans": census.ByPubTrans,
            "ByWalk": census.ByWalk})
        return acc
    }
    return(data.tractsBostonBariLayer.features.reduce(reducer, []))
}


export default function CommuteTable(props) {
    const data = useStaticQuery(graphql`
    query CommuteTableQuery {
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
                fields {
                averageCommute
                }
                ByAuto
                ByBike
                ByPubTrans
                ByWalk
            }
        }
    }`);
    const joined_data = fuckingInnerJoin(data)
    // This sorting syntax to exclude null values from https://stackoverflow.com/questions/29829205/sort-an-array-so-that-null-values-always-come-last
    joined_data.sort((a, b) => (a.averageCommute===null)-(b.averageCommute===null) || +(a.averageCommute>b.averageCommute)||-(a.averageCommute<b.averageCommute))
    //console.log(joined_data)
    var gradient = new Rainbow();
    gradient.setSpectrum('green', 'yellow', 'red')
    gradient.setNumberRange(10, 75)
    return(
        <Container>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Census Tract ID</th>
                        <th>Neighborhood</th>
                        <th>Commute Time</th>
                        <th>% Commuting by Public Transit</th>
                        <th>% Commuting by Car</th>
                        <th>% Commuting by Walking</th>
                        <th>% Commuting by Bike</th>

                    </tr>
                </thead>
                <tbody>
                    {joined_data.slice(0,11).map((node) => 
                    <tr>
                        <td>
                            {node.CT_ID_10}
                        </td>
                        <td>
                            {node.ISD_Nbhd}
                        </td>
                        <td>
                            <p style={{color: "#" + gradient.colourAt(node.averageCommute)}}>{Math.round(node.averageCommute)} minutes</p>
                        </td>
                        <td>
                            {(parseFloat(node.ByPubTrans) * 100).toFixed(2)}%
                        </td>
                        <td>
                            {(parseFloat(node.ByAuto) * 100).toFixed(2)}%
                        </td>
                        <td>
                            {(parseFloat(node.ByWalk) * 100).toFixed(2)}%
                        </td>
                        <td>
                            {(parseFloat(node.ByBike) * 100).toFixed(2)}%
                        </td>
                    </tr>
                    )
                    }
                </tbody>
            </Table>
        </Container>
    )
}