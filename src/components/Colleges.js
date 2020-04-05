import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import { Row } from 'react-bootstrap'
import { MeterToMile } from '../lib/util'
import ReactDOMServer from 'react-dom/server';
import { FIFTEEN_DIST } from '../lib/vars';

var Rainbow = require('rainbowvis.js');

const PopupContent = (props) => {
    return(
        <>
        <Row><b>Closest School: </b> {props.school.name}, {props.school.distance.toFixed(2)} miles away</Row>
        </>
        )
}

export default function Colleges() {
    const data = useStaticQuery(graphql`
        query CollegeQuery{
            allCollegesAndUniversitiesCsv {
                nodes {
                    Latitude
                    Longitude
                    Name
                }
            }
            tractsBostonBariLayer(name: {eq: "Tracts_Boston BARI"}) {
                features {
                    geometry {
                        type
                        coordinates
                        centroid {
                            x
                            y
                        }
                    }
                    featureFields {
                        ISD_Nbhd
                        CT_ID_10
                    }
                }
            }
        }
    `)

    data.tractsBostonBariLayer.features.map((feature) => {
        const nbhd_point = L.latLng(feature.geometry.centroid.y, feature.geometry.centroid.x);
        const school_list = data.allCollegesAndUniversitiesCsv.nodes.map((school) => {
            return {
                "name": school.Name, 
                "distance": MeterToMile(nbhd_point.distanceTo(L.latLng(school.Latitude, school.Longitude)))}
        })
       school_list.sort((a,b) => a.distance - b.distance)
       feature.closest_school = school_list[0]
    })
    var gradient = new Rainbow();
    gradient.setSpectrum('green', 'yellow', 'red')
    gradient.setNumberRange(FIFTEEN_DIST, 3)

    return(data.tractsBostonBariLayer.features.map((node) => 
            <GeoJSON data={node.geometry}
            key={node.featureFields.CT_ID_10}
            attribution="Boston Data Portal"      
            color={"#" + gradient.colourAt(node.closest_school.distance)}
            onEachFeature={( feature, layer ) => layer.bindPopup( ReactDOMServer.renderToString(
                <PopupContent 
                school={node.closest_school}
                />
            ))}
            />
    ))}