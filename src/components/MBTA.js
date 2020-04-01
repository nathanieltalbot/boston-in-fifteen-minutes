import React from 'react';
import { graphql, useStaticQuery } from 'gatsby'
import { Marker, Popup } from 'react-leaflet'
import { Container, Row } from 'react-bootstrap'
import L from 'leaflet'
import proj4 from 'proj4'

export default function MBTA(props) {
    
    const data = useStaticQuery(graphql`
        query MyQuery {
            allStopsCsv(filter: {vehicle_type: {eq: "1"}}) {
                nodes {
                    stop_lat
                    stop_lon
                    stop_name
                    id
                    stop_desc
                }
            }
        }
        `)
    let stop_re = /(Red Line|Blue Line|Orange Line|Green Line|Silver Line)/
    return(
        data.allStopsCsv.nodes.map((node) => 
        <Marker key={node.id} position={[node.stop_lat, node.stop_lon]} title={node.stop_name}>
            <Popup>
                <Row>
                    <b>{node.stop_name}</b>
                </Row>
                <Row>{node.stop_desc.match(stop_re)[0]}</Row>
            </Popup>
        </Marker>
        )
       
    )
}