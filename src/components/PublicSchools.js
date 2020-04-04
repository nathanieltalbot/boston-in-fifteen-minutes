import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import { Row } from 'react-bootstrap'
import { MeterToMile } from '../lib/util'
import ReactDOMServer from 'react-dom/server';
var Rainbow = require('rainbowvis.js');

const PopupContent = (props) => {
    return(
        <>
        <Row><b>Number of schools: </b> {props.schools.length}</Row>
        {props.schools.map((school) => <Row>{school.name}</Row>)}
        </>
        )
}

export default function PublicSchools() {
    const data = useStaticQuery(graphql`
        query PublicSchoolQuery{
            allPublicSchoolsCsv(filter: {SCH_TYPE: {in: ["K-8", "ES", "K-12", "MS", "6/7-12"]}}) {
                nodes {
                    fields {
                        latitude
                        longitude
                    }
                    SCH_TYPE
                    ADDRESS
                    SCH_NAME
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
        const school_list = data.allPublicSchoolsCsv.nodes.map((school) => {
            return {
                "name": school.SCH_NAME, 
                "type": school.SCH_TYPE,
                "address": school.ADDRESS, 
                "distance": MeterToMile(nbhd_point.distanceTo(L.latLng(school.fields.latitude, school.fields.longitude)))}
        })
        feature.closest_schools = school_list.filter((a) => a.distance <= 1)
    })
    var gradient = new Rainbow();
    gradient.setSpectrum('red', 'yellow', 'green')
    gradient.setNumberRange(1, 10)

    return(data.tractsBostonBariLayer.features.map((node) => 
            <GeoJSON data={node.geometry}
            key={node.featureFields.CT_ID_10}
            attribution="Boston Data Portal"      
            color={"#" + gradient.colourAt(node.closest_schools.length)}
            onEachFeature={( feature, layer ) => layer.bindPopup( ReactDOMServer.renderToString(
                <PopupContent 
                schools={node.closest_schools}
                />
            ))}
            />
    ))}