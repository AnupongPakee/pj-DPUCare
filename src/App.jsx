import React from 'react'
import { useNavigate } from "react-router-dom"

import STYLE from "./style/Style"

function App() {
  const navigate = useNavigate()
  return (
    <div className='container index' style={STYLE.container}>
      <div className="content-1">
        <div className="left">
          <h1 style={STYLE.font_family.th}>แชทบอทให้คำปรึกษา</h1>
          <p style={STYLE.font_family.th}> DPU Care เป็นบริการแชทบอทที่ให้คำปรึกษาด้านความเครียด</p>
          <div className="btn">
            <button style={STYLE.font_family.th} onClick={() => navigate("/pj-DPUCare/login")}>เข้าสู่ระบบ</button>
            <button style={STYLE.font_family.th} onClick={() => navigate("/pj-DPUCare/register")}>สร้างบัญชี</button>
          </div>
          <div className="blur"></div>
        </div>
        <div className="right"></div>
      </div>
      <div className="not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
    </div>
  )
}

export default App
