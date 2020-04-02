import {CommuteTimeMidpoint} from './src/lib/util'

exports.onCreateNode = ({ node, actions }) => {
  const { createNode, createNodeField } = actions
  // Transform the new node here and create a new node or
  // create a new node field.
  //console.log(node.internal.type === "HospitalsCsv")
  //console.log(node.id)
  if (node.internal.type === "Acs1216TractCsv") {
      console.log(node.id)
      createNodeField({
          node,
          name: 'averageCommute',
          value: CommuteTimeMidpoint(node)
      })
  }
}