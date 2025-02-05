import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faUpload, faPaperPlane } from "@fortawesome/free-solid-svg-icons"

import STYLE from "../style/Style"

function Admin() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate()

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000)
  }, [])
  return (
    <div className='container admin' style={STYLE.container}>
      <div className="content">
        <div className="date-time">
          <h1 style={STYLE.font_family.en}>{time.toLocaleTimeString()}</h1>
          <h3 style={STYLE.font_family.en}>{time.toDateString()}</h3>
        </div>
        <div className="data">
          <h1 style={STYLE.font_family.en}>data</h1>
        </div>
        <div className="chat">
          <form action="">
            <input type="text" placeholder='ป้อนคำคาม' />
          </form>
        </div>
        <div className="prompt-templete">
          <form action="">
            <input type="text" value={"prompt templete"} style={STYLE.font_family.en} />
          </form>
        </div>
        <div className="logo">
          <h1 style={STYLE.font_family.en}>Admin</h1>
        </div>
        <div className="token-calculator">
          <h3 style={STYLE.font_family.en}>40,5000 token</h3>
        </div>
        <div className="test">
          <h1 style={STYLE.font_family.en}>test system</h1>
        </div>
        <div className="exit" style={STYLE.font_family.en}>
          exit
        </div>
      </div>
      <div className="admin-not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
    </div>
  )
}

export default Admin