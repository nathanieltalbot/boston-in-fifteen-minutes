import React from 'react'
import { GeoJSON } from 'react-leaflet'
import { Row } from 'react-bootstrap'
import L from 'leaflet'
import { graphql, useStaticQuery } from 'gatsby'
import { MeterToMile } from '../lib/util.js'
import ReactDOMServer from 'react-dom/server';

var Rainbow = require('rainbowvis.js');

const PopupContent = (props) => {
    return(<><b>Closest Hospital: </b> {props.hospital.name}, {props.hospital.distance.toFixed(2)} miles away</>)
}

export default function Hospitals(props) {
    const data = useStaticQuery(graphql`
        query HospitalQuery{
            allHospitalsCsv {
                nodes {
                    Name
                    Latitude
                    Longitude
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
    //console.log(data)
    data.tractsBostonBariLayer.features.map((feature) => {
        const nbhd_point = L.latLng(feature.geometry.centroid.y, feature.geometry.centroid.x);
        const hospital_list = data.allHospitalsCsv.nodes.map((hospital) => {
            return {"name": hospital.Name, "distance": MeterToMile(nbhd_point.distanceTo(L.latLng(hospital.Latitude, hospital.Longitude)))}
        })
        hospital_list.sort((a,b) => a.distance - b.distance)
        feature.closest_hospital = hospital_list[0]
    })

    var gradient = new Rainbow();
    gradient.setSpectrum('green', 'yellow', 'red')
    gradient.setNumberRange(1, 3)

    return(data.tractsBostonBariLayer.features.map((node) => 
        <GeoJSON data={node.geometry}
          key={node.featureFields.CT_ID_10}
          attribution="Boston Data Portal" 
          color={"#" + gradient.colourAt(node.closest_hospital.distance)}
          onEachFeature={( feature, layer ) => layer.bindPopup( ReactDOMServer.renderToString(
            <PopupContent 
              hospital={node.closest_hospital}
            />
          ))}
          />
    ))
}