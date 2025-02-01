import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faExpand } from "@fortawesome/free-solid-svg-icons"

import STYLE from "./style/Style"

function App() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate()

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000)
  }, [])
  return (
    <div className='container home' style={STYLE.container}>
      <div className="content">
        <div className="date-time">
          <h1 style={STYLE.font_family.en}>{time.toLocaleTimeString()}</h1>
          <h3 style={STYLE.font_family.en}>{time.toDateString()}</h3>
        </div>
        <div className="chat">
          <h1 style={STYLE.font_family.th} onClick={() => navigate("/pj-DPUCare/chat")}>แชทบอท</h1>
          <div className="show-message">
            <FontAwesomeIcon icon={faExpand} className='icon-full' onClick={() => navigate("/pj-DPUCare/chat")} />
            <div className='ai'>
              <p className='ai-message' style={STYLE.font_family.th}>สวัสดีชาวโลกผู้โง่เขา</p>
            </div>
            <div className='human'>
              <p className='human-message' style={STYLE.font_family.th}>สวัสดีไอบอทอวดเก่ง</p>
            </div>
          </div>
          <form action="">
            <input type="text" placeholder='ลองพิมพ์ดู' style={STYLE.font_family.th} />
            <button type="submit">
              <FontAwesomeIcon icon={faPaperPlane} className='icon-send' />
            </button>
          </form>
        </div>
        <div className="logo">
          <h1 style={STYLE.font_family.en}>DPU Care</h1>
        </div>
        <div className="setting" style={STYLE.font_family.th} onClick={() => navigate("/pj-DPUCare/login")}>
          เข้าสู่ระบบ
        </div>
        <div className="CoT">
          <h1>วิเคราะห์</h1>
        </div>
        <div className="exit" style={STYLE.font_family.th} onClick={() => navigate("/pj-DPUCare/register")}>สร้างบัญชี</div>
      </div>
      <div className="not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
    </div>
  )
}

export default App