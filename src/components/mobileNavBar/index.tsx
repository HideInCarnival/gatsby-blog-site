import React, {useState} from 'react'
import {blog} from '../../types'
import './index.css'

interface props {
  blog: blog,
  setCurCol?: (colName: string) => void,
  curCol: string,
  isMobile: boolean,
  increaseColCount: () => void
}

export default function MobileNavBar({blog, setCurCol, curCol, increaseColCount}: props) {
  const [navShow, setNavShow] = useState(false);
  let curTypeName = "最新文章";
  blog.cols.forEach(item => {
    if (item.dirName === curCol) {
      curTypeName = item.typeName;
    }
  })
  const [curColName, setCurColName] = useState(curTypeName)
  const setCurColType = (typeName: string) => {
    setCurColName(typeName);
  }
  
  return (
    <div className="mobile-nav-bar-wrapper h-8 relative">
      <div className="h-full leading-8 bg-gray-200 text-lg" onClick={() => {setNavShow(!navShow)}}>
        <svg className={`icon inline-block mr-2 transform ${navShow?'rotate-90':'rotate-0'}`} aria-hidden="true" style={{width: "1.2rem", height: "1.2rem"}}>
          <use xlinkHref={`#icon-arrow`}></use>
        </svg>
        <span className="leading-8 inline-block">
          { curColName }
        </span>
      </div>
      <ul className={`absolute w-full left-0 top-8 bg-gray-200 ${navShow?'block':'hidden'}`}>
        {
          blog.cols.map(item => (
            // <Link  to="/">
              <li key={item.typeName}
                  className={`blog-item py-2 text-center hover:text-white hover:bg-choosed cursor-pointer ${curCol === item.dirName?'active':''}`} 
                  onClick={() => {setCurCol(item.dirName); setCurColType(item.typeName); setNavShow(false); increaseColCount();}}
              >
                  <svg className="icon inline-block mr-2" aria-hidden="true" style={{width: "1.2rem", height: "1.2rem"}}>
                    <use xlinkHref={`#${item.iconName}`}></use>
                  </svg>
                <span>
                  {item.typeName}
                </span>
              </li>
            // </Link>
          ))
        }
      </ul>
    </div>
  )
}
