/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
const { createFilePath } = require("gatsby-source-filesystem")
const path = require("path");
exports.onCreateNode = ({ node, getNode, actions }) => {
  const {createNodeField} = actions;
  if(node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `slug`,
      value: slug
    })
    createNodeField({
      node,
      name: `relativeDirectory`,
      value: getNode(node.parent).relativeDirectory
    })
  }
}

// exports.createPages = async ({ graphql, actions }) => {
//   const {createPage} = actions;
//   const result = await graphql(`
//     query {
//       allMarkdownRemark {
//         edges {
//           node {
//             id
//             fields {
//               relativeDirectory
//             }
//           }
//         }
//       }
//     }
//   `)
//   // const nodeArray = result.data.allMarkdownRemark.edges;
//   // const directorys = [];
//   // const mdIds = [];
//   // for (let i = 0; i < nodeArray.length; i++) {
//   //   const node = nodeArray[i];
//   //   directorys.push(node.fields.relativeDirectory);
//   //   mdIds.push(node.id);
//   // }
//   // for ()
//   result.data.allMarkdownRemark.edges.map(({node}) => {
//     createPage({
//       path: `/${node.fields.relativeDirectory}/${id}`,
//       component: path.resolve(`./src/templates/blog-post.tsx`),
//       context: {
//         slug: node.fields.slug,
//         dir: node.fields.relativeDirectory
//       }
//     });
//   })
// }