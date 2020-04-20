import React from 'react';
import { graphql, useStaticQuery } from 'gatsby'
import { GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import { MeterToMile, utmToLatLng } from '../lib/util.js'
import ReactDOMServer from 'react-dom/server';
import { FIFTEEN_DIST } from '../lib/vars.js';

var Rainbow = require('rainbowvis.js');

const PopupContent = (props) => {
return(<><b>Closest Pharmacy: </b> {props.store.name}, {props.store.address}, {props.store.distance.toFixed(2)} miles away</>)
}

export default function Pharmacies() {
    const data = useStaticQuery(graphql`
        query PharmacyQuery {
            allFoodRetailers2016Csv(filter: {prim_type: {eq: "Pharmacies & Drug Stores"}, recordtype: {eq: "Verified"}}) {
                nodes {
                    longitude
                    latitude
                    name
                    prim_type
                    address
                    municipal

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
        const store_list = data.allFoodRetailers2016Csv.nodes.map((store) => {
            const coords = L.latLng(store.latitude, store.longitude)
            return({"name": store.name, "distance": MeterToMile(nbhd_point.distanceTo(L.latLng(coords))), "address": `${store.address}, ${store.municipal}`})
        })
        store_list.sort((a,b) => a.distance - b.distance)
        feature.closest_store = store_list[0]
    })

    var gradient = new Rainbow();
    gradient.setSpectrum('green', 'yellow', 'red')
    gradient.setNumberRange(FIFTEEN_DIST, 3)

    return(data.tractsBostonBariLayer.features.map((node) => 
        <GeoJSON data={node.geometry}
          key={node.featureFields.CT_ID_10}
          attribution="Boston Data Portal"      
          color={"#" + gradient.colourAt(node.closest_store.distance)}
          onEachFeature={( feature, layer ) => layer.bindPopup( ReactDOMServer.renderToString(
            <PopupContent 
              store={node.closest_store}
            />
          ))}
          />
    ))
}
