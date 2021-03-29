import React, {useState, useEffect} from 'react'
import {graphql} from 'gatsby'
import {blog} from '../../config/blog.config'
import Layout from '../../components/layout'
import LeftNav from '../../components/leftnav'
import Catalog from '../../components/catalog'
import SEO from '../../components/seo'
import MainContent from '../../components/maincontent'
const SingleBlogPage = ({data,params}) => {
  const [colChangeCount, setColChangeCount] = useState(0);
  const [curCol, setCurCol] = useState(params.fields__relativeDirectory || '');
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const initIsMobile = window.screen.width < 640;
    setIsMobile(initIsMobile);
    window.onresize = function() {
      setIsMobile(window.screen.width < 640);
    }
  },[])
  let nodes = data.allMarkdownRemark.edges;
  const aboutBlogNode = data.allMarkdownRemark.edges.filter(edge => {
    return edge.node.frontmatter.title === "关于博客"
  })
  const address = `/${aboutBlogNode[0].node.fields.relativeDirectory}/${aboutBlogNode[0].node.id}`
  if (curCol) {
    nodes = nodes.filter(item => {
      return item.node.fields.relativeDirectory === curCol;
    })
  }
  const increaseColCount = () => {
    setColChangeCount(colChangeCount + 1);
  }
  const clearColCount = () => {
    setColChangeCount(0);
  }

  
  return (
    <Layout>
      <SEO title="Home" />
      <div className="container left-columns">
        <LeftNav blog={blog} curCol={curCol} isMobile={isMobile} personalAddress={address} notIndex increaseColCount={increaseColCount} setCurCol={(colName) => {setCurCol(colName)}} />
      </div>
      <div className="container">
        <Catalog blogs={nodes} />
      </div>
      <div className="container main">
        {
          colChangeCount > 0 ?
          <MainContent blogDetailArray={isMobile ? nodes : data.allMarkdownRemark.edges} clearColCount={clearColCount} isMobiel={isMobile} />
          :
          <MainContent mdContent={data.markdownRemark} isMobiel={isMobile} />
        }
      </div>
    </Layout>
  )
}

export default SingleBlogPage
export const query = graphql`
  query($id: String) {
    markdownRemark(id: {eq: $id}) {
      id
      html
      frontmatter {
        title
        date
      }
    }
    allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
      edges {
        node {
          id
          frontmatter {
            title
            date
          }
          fields {
            relativeDirectory
          }
        }
      }
    }
  }
`