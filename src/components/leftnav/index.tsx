import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import {blog} from '../../types'
import {Link} from 'gatsby'
import MobileNavBar from '../mobileNavBar'
import './index.css'

interface props {
  blog: blog,
  setCurCol?: (colName: string) => void,
  increaseColCount: () => void,
  curCol: string,
  notIndex: boolean,
  isMobile: boolean,
  personalAddress: string
}

export default function LeftNav({blog, setCurCol, increaseColCount, notIndex, curCol, isMobile, personalAddress}: props) {
  const clickAvate = () => {
    if (!notIndex) {
      setCurCol('');
    }
  }
  return (
    <>
      <div id="mobile-left-nav" className="sm:hidden pt-4">
        <div className="head">
          <Link to="/">
              <div className="avatar-wrapper text-center cursor-pointer" onClick={clickAvate}>
                <StaticImage 
                  src="../../images/fox.jpg"
                  height={90}
                  width={90}
                  alt="My fox avatar"
                  style={{
                    borderRadius: '50%',
                    width: 90,
                    height: 90,
                  }}
                />
              </div>
          </Link>
        </div>
        {
          isMobile &&
          <div className="mobile-nav-bar">
            <MobileNavBar blog={blog} setCurCol={setCurCol} increaseColCount={increaseColCount} curCol={curCol} isMobile={isMobile} />
          </div>
        }
      </div>
      <div id="left-nav" className="h-full xs:hidden">
      <div className="leftnav-wrapper container h-full bg-gray-200 rounded-r relative">
        <div className="head">
          <Link to="/">
            <div className="avatar-wrapper text-center cursor-pointer" onClick={clickAvate}>
              <StaticImage 
                src="../../images/fox.jpg"
                height={90}
                width={90}
                alt="My fox avatar"
                style={{
                  borderRadius: '50%',
                  width: 90,
                  height: 90,
                }}
              />
            </div>
            </Link>
        </div>
        <div className="nav-list">
          <ul className="text-lg font-light leading-9 text-primary">
            {
              blog.cols.map(item => (
                <li key={item.typeName}
                    className={`blog-item text-center hover:text-white hover:bg-choosed cursor-pointer ${curCol === item.dirName?'active':''}`} 
                    onClick={() => {setCurCol(item.dirName)}}
                >
                    <svg className="icon inline-block mr-2" aria-hidden="true" style={{width: "1.2rem", height: "1.2rem"}}>
                      <use xlinkHref={`#${item.iconName}`}></use>
                    </svg>
                  <span>
                    {item.typeName}
                  </span>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="contact h-16 grid grid-cols-2 absolute bottom-0 w-full border-t  border-gray-400">
          <div className="person h-full w-full flex justify-center items-center">
            <Link to={personalAddress}>
            <svg className="icon" aria-hidden="true" style={{width: "2.5rem", height: "2.5rem"}}>
              <use xlinkHref="#icon-caidaniconwodehui"></use>
            </svg>
            </Link>
          </div>
          <div className="mail h-full w-full flex justify-center items-center">
            <a href="mailto:bobblugo@gmail.com">
              <svg className="icon" aria-hidden="true" style={{width: "2.5rem", height: "2.5rem"}}>
                <use xlinkHref="#icon-mail"></use>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
