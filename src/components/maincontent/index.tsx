import React from 'react'
import {blogDetailNode} from '../../types'
import {mdInfo} from '../../types'
import {Link} from 'gatsby'
import './index.scss'

interface props {
  blogDetailArray?: blogDetailNode[],
  mdContent?: mdInfo,
  isMobile: boolean,
  clearColCount: () => void,
}
export default function MainContent({blogDetailArray, mdContent, clearColCount}: props) {
  return (
    <div className={`catalog text-primary px-12 h-full`}>
      <div className={`title text-2xl h-24 pt-6 ${mdContent && 'text-center'}`}>
        {
          mdContent ? mdContent.frontmatter.title : 
          "最新文章"
        }
      </div>
      <div className="article-table" style={{height: "calc(100% - 6rem)"}}>
        {
          mdContent ? <div className="h-full overflow-y-auto md-nice" dangerouslySetInnerHTML={{__html: mdContent.html}} /> :
          <ul className="list-disc pl-8 pt-4 h-full overflow-y-auto">
            {
              blogDetailArray!.map(item => (
                <Link className="text-gray-900" key={item.node.id} to={`/${item.node.fields.relativeDirectory}/${item.node.id}`}>
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
