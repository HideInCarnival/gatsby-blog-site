import React from 'react'
import {blogDetailNode} from '../../types'
import {mdInfo} from '../../types'
import {Link} from 'gatsby'

interface props {
  blogDetailArray?: blogDetailNode[],
  mdContent?: mdInfo,
  isMobile: boolean,
  clearColCount: () => void,
}
export default function MainContent({blogDetailArray, mdContent, clearColCount}: props) {
  return (
    <div className={`catalog text-primary px-12 h-full`}>
      <div className={`title text-2xl h-12 pt-4 ${mdContent && 'text-center'}`}>
        {
          mdContent ? mdContent.frontmatter.title : 
          "最新文章"
        }
      </div>
      <div className="article-table" style={{height: "calc(100% - 3rem)"}}>
        {
          mdContent ? <div className="h-full overflow-y-auto" dangerouslySetInnerHTML={{__html: mdContent.html}} /> :
          <ul className="list-disc pl-8 pt-4 h-full overflow-y-auto">
            {
              blogDetailArray.map(item => (
                <Link key={item.node.id} to={`/${item.node.fields.relativeDirectory}/${item.node.id}`}>
                  <li key={item.node.id} className="py-2 hover:underline" onClick={clearColCount}>
                    {item.node.frontmatter.title}
                  </li>
                </Link>
              ))
            }
          </ul>
        }
      </div>
    </div>
  )
}
