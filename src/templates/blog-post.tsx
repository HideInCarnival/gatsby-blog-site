// import * as React from "react"
// import Layout from "../components/layout"
// import LeftNav from '../components/leftnav'
// import Catalog from '../components/catalog'
// import MainContent from '../components/maincontent'
// import SEO from "../components/seo"
// import {graphql} from 'gatsby'
// import {blog} from '../config/blog.config'
// import {mdInfo} from '../types'
// interface props {
//   data: {
//     markdownRemark: mdInfo
//   }
// }
// export default ({data}: props) => {
//   const mdInfo = data.markdownRemark;
//   return (
//     <Layout>
//       <SEO title="Home" />
//       <div className="container left-columns">
//         <LeftNav blog={blog} />
//       </div>
//       <div className="container">
//         {/* <Catalog /> */}
//       </div>
//       <div className="container main">
//         <MainContent mdContent={mdInfo} />
//       </div>
//     </Layout>
//   )
// }
// export const query = graphql`
//   query($slug: String!, $dir: String) {
//     markdownRemark(fields: {slug: { eq: $slug }, relativeDirectory: { eq: $dir }}) {
//       id
//       html
//       frontmatter {
//         date
//         title
//       }
//       fields {
//         relativeDirectory
//       }
//     }
//   }
// `