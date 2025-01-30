import React from 'react'

import STYLE from "../style/Style"

function Home() {
  return (
    <div className='container home' style={STYLE.container}>
        <div className="content">
            <div className="date-time">date time</div>
            <div className="chat">chat</div>
            <div className="logo">DPU Care</div>
            <div className="setting">setting</div>
            <div className="CoT">CoT</div>
            <div className="exit">exit</div>
        </div>
    </div>
  )
}

export default Home