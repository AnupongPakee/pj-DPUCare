import React, { useEffect, useState } from 'react'

import STYLE from "../style/Style"

function Home() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000)
  }, [])
  return (
    <div className='container home' style={STYLE.container}>
      <div className="content">
        <div className="date-time">
          <h1>{time.toLocaleTimeString()}</h1>
          <h3>{time.toDateString()}</h3>
          <div className="blur"></div>
        </div>
        <div className="chat">chat</div>
        <div className="logo">DPU Care</div>
        <div className="setting">setting</div>
        <div className="CoT">CoT</div>
        <div className="exit">exit</div>
      </div>
      <div className="not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
    </div>
  )
}

export default Home