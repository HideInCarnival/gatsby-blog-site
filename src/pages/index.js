import React, {useState, useEffect} from "react"
import Layout from "../components/layout"
import LeftNav from '../components/leftnav'
import Catalog from '../components/catalog'
import MainContent from '../components/maincontent'
import SEO from "../components/seo"
import {blog} from '../config/blog.config'
import {graphql} from 'gatsby'
// import {getUserAgent} from '../lib/utils'


const Home = ({data}) => {
  const [curCol, setCurCol] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const aboutBlogNode = data.allMarkdownRemark.edges.filter(edge => {
    return edge.node.frontmatter.title === "关于博客"
  })
  const address = `/${aboutBlogNode[0].node.fields.relativeDirectory}/${aboutBlogNode[0].node.id}`
  useEffect(() => {
    const initIsMobile = window.screen.width < 640;
    setIsMobile(initIsMobile);
    window.onresize = function() {
      setIsMobile(window.screen.width < 640);
    }
  },[])
  let nodes = data.allMarkdownRemark.edges;
  if (curCol) {
    nodes = nodes.filter(item => {
      return item.node.fields.relativeDirectory === curCol;
    })
  }
  return (
    <Layout>
      <SEO title="Home" />
      <div className="container left-columns">
        <LeftNav blog={blog} curCol={curCol} isMobile={isMobile} personalAddress={address} setCurCol={(colName) => {setCurCol(colName)}} />
      </div>
      <div className="container xs:hidden">
        <Catalog blogs={nodes} />
      </div>
      <div className="container main">
        <MainContent blogDetailArray={isMobile ? nodes : data.allMarkdownRemark.edges} isMobile={isMobile} />
      </div>
    </Layout>
  )
}

export default Home
export const query = graphql`
  query {
    allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
      edges {
        node {
          id
          html
          fields {
            relativeDirectory
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
          }
        }
      }
    }
  }
`