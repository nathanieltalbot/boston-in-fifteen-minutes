import React from 'react'
import { GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import { graphql, useStaticQuery } from 'gatsby'
import { MeterToMile, utmToLatLng } from '../lib/util.js'
import ReactDOMServer from 'react-dom/server';
import { FIFTEEN_DIST } from '../lib/vars.js';

var Rainbow = require('rainbowvis.js');

const PopupContent = (props) => {
    return(<><b>Closest Hospital: </b> {props.hospital.name}, {props.hospital.distance.toFixed(2)} miles away</>)
}

export default function Hospitals(props) {
    const data = useStaticQuery(graphql`
        query HospitalQuery{
            acuteCareLayer(name: {eq: "OGRGeoJSON"}) {
                features {
                    featureFields {
                        name
                    }
                    geometry {
                        coordinates
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
    //console.log(data)
    data.tractsBostonBariLayer.features.map((feature) => {
        const nbhd_point = L.latLng(feature.geometry.centroid.y, feature.geometry.centroid.x);
        const hospital_list = data.acuteCareLayer.features.map((hospital) => {
            //const coords = utmToLatLng(hospital.geometry.coordinates)
            return({"name": hospital.featureFields.name, "distance": MeterToMile(nbhd_point.distanceTo(L.latLng(hospital.geometry.coordinates[1], hospital.geometry.coordinates[0])))})
        })
        hospital_list.sort((a,b) => a.distance - b.distance)
        feature.closest_hospital = hospital_list[0]
    })

    var gradient = new Rainbow();
    gradient.setSpectrum('green', 'yellow', 'red')
    gradient.setNumberRange(FIFTEEN_DIST, 3)

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