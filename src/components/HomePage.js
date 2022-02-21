import React from 'react'

export default function HomePage(props) {
  return (
    <div className="home_page_container">
      <div
        onClick={() => props.setActiveComponent('categories')}
        className="option_box"
      >
        <p className="option_heading">Manage Categories</p>
      </div>
      <div
        onClick={() => props.setActiveComponent('materials')}
        className="option_box"
      >
        <p className="option_heading">Manage Materials</p>
      </div>
    </div>
  )
}
