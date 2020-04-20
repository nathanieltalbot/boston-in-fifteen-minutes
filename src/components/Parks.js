import React from 'react';
import { graphql, useStaticQuery } from 'gatsby'
import { GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import { MeterToMile, utmToLatLng } from '../lib/util.js'
import ReactDOMServer from 'react-dom/server';
import { FIFTEEN_DIST } from '../lib/vars.js';

var Rainbow = require('rainbowvis.js');

const PopupContent = (props) => {
    return(<><b>Closest Park: </b> {props.park.name}, {props.park.distance.toFixed(2)} miles away</>)
}

export default function Parks() {
    const data = useStaticQuery(graphql`
        query OpenSpaceQuery {
            openSpaceLayer(name: {eq: "OGRGeoJSON"}) {
                name
                features {
                    geometry {
                        centroid {
                            x
                            y
                        }
                    }
                    featureFields {
                        SITE_NAME
                    }
                }
            },
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
        const parks_list = data.openSpaceLayer.features.map((park) => {
            const coords = L.latLng(park.geometry.centroid.y, park.geometry.centroid.x)
            return({"name": park.featureFields.SITE_NAME, "distance": MeterToMile(nbhd_point.distanceTo(L.latLng(coords)))})
        })
        parks_list.sort((a,b) => a.distance - b.distance)
        feature.closest_park = parks_list[0]
    })

    var gradient = new Rainbow();
    gradient.setSpectrum('green', 'yellow', 'red')
    gradient.setNumberRange(FIFTEEN_DIST, 3)

    return(data.tractsBostonBariLayer.features.map((node) => 
        <GeoJSON data={node.geometry}
          key={node.featureFields.CT_ID_10}
          attribution="Boston Data Portal"      
          color={"#" + gradient.colourAt(node.closest_park.distance)}
          onEachFeature={( feature, layer ) => layer.bindPopup( ReactDOMServer.renderToString(
            <PopupContent 
              park={node.closest_park}
            />
          ))}
          />
    ))
}
