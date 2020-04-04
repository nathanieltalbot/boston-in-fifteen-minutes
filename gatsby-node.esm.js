import {CommuteTimeMidpoint} from './src/lib/util'
import proj4 from 'proj4'
import { UTM_STRING, WGS_STRING } from './src/lib/vars'

exports.onCreateNode = ({ node, actions }) => {
  const { createNode, createNodeField } = actions
  // Transform the new node here and create a new node or
  // create a new node field.

  if (node.internal.type === "Acs1216TractCsv") {
      createNodeField({
          node,
          name: 'averageCommute',
          value: CommuteTimeMidpoint(node)
      })
  }
  //Converting UTM into lat/long
  else if (node.internal.type === "PublicLibrariesCsv" || node.internal.type === "PublicSchoolsCsv") {
      var coords = proj4(UTM_STRING, WGS_STRING,[parseFloat(node.X), parseFloat(node.Y)])
      createNodeField({
        node,
        name: 'latitude',
        value: coords[1]
      })
      createNodeField({
        node,
        name: 'longitude',
        value: coords[0]
      })
  }
}