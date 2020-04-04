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
            <Row><b>Closest library: </b> {props.library.name}</Row>
            <Row>{props.library.distance.toFixed(2)} miles away</Row>
            <Row>{props.library.address}</Row>
        </>)
}

export default function Libraries() {
    const data = useStaticQuery(graphql`
        query LibraryQuery{
            allPublicLibrariesCsv {
                nodes {
                    BRANCH
                    ST_ADDRESS
                    fields {
                        longitude
                        latitude
                    }
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
        const library_list = data.allPublicLibrariesCsv.nodes.map((library) => {
            return {
                "branch": library.BRANCH, 
                "address": library.ST_ADDRESS, 
                "distance": MeterToMile(nbhd_point.distanceTo(L.latLng(library.fields.latitude, library.fields.longitude)))}
        })
        library_list.sort((a,b) => a.distance - b.distance)
        feature.closest_library = library_list[0]
    })

    console.log(data)

    var gradient = new Rainbow();
    gradient.setSpectrum('green', 'yellow', 'red')
    gradient.setNumberRange(FIFTEEN_DIST, 3)

        return(data.tractsBostonBariLayer.features.map((node) => 
            <GeoJSON data={node.geometry}
            key={node.featureFields.CT_ID_10}
            attribution="Boston Data Portal"      
            color={"#" + gradient.colourAt(node.closest_library.distance)}
            onEachFeature={( feature, layer ) => layer.bindPopup( ReactDOMServer.renderToString(
                <PopupContent 
                library={node.closest_library}
                />
            ))}
            />
    ))
}