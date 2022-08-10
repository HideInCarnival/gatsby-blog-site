import React from 'react'
import {blogDetailNode} from '../../types'
import {Link} from 'gatsby'

interface props {
  blogs: blogDetailNode[]
}
export default function index({blogs}: props) {
  return (
    <div className="catalog h-full xs:hidden">
      <div className="target pt-4 text-primary font-normal text-center text-xl" style={{height: '6rem'}}>
        <p>
          有何胜利可言
        </p>
        <p>
          挺住就是一切
        </p>
      </div>
      <div className="catalog-wrapper"  style={{height: 'calc(100% - 6rempx'}}>
        <div className="searchbar bg-gray-800 hidden" style={{height: '3rem'}}>
          search-bar
        </div>
        <div className="article-catalog-wrapper" style={{height: 'calc(100% - 3rem)'}}>
          <ul className="article-catalog font-light text-center text-primary text-lg overflow-y-auto h-full">
            {
              blogs.map((item) => (
                <Link className="text-gray-900" key={item.node.id} to={`/${item.node.fields.relativeDirectory}/${item.node.id}`}>
                  <li key={item.node.id} className="py-2 text-left pl-3 overflow-x-hidden hover:underline">
                    {item.node.frontmatter.title}
                  </li>
                </Link>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
