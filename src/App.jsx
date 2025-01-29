import React from 'react'
import { useNavigate } from "react-router-dom"

import STYLE from "./style/Style"

function App() {
  const navigate = useNavigate()
  return (
    <div className='container home' style={STYLE.container}>
      <div className="content-1">
        <div className="left">
          <h1 style={STYLE.font_family.th}>แชทบอทให้คำปรึกษา</h1>
          <p style={STYLE.font_family.th}> DPU Care เป็นบริการแชทบอทที่ให้คำปรึกษาด้านความเครียด โดยมีการนำเอาแนวคิดของ RAG เข้ามาช่วยในการสืบค้นข้อมูล และยังนำเอา CoT เข้ามาช่วยในการวิเคราะห์และประเมินอาการ</p>
          <div className="btn">
            <button style={STYLE.font_family.th} onClick={() => navigate("/pj-DPUCare/login")}>เข้าสู่ระบบ</button>
            <button style={STYLE.font_family.th} onClick={() => navigate("/pj-DPUCare/register")}>สร้างบัญชี</button>
          </div>
          <div className="blur"></div>
        </div>
        <div className="right"></div>
      </div>
      <div className="content-2">
        <h1 style={STYLE.font_family.th}>บริการหลัก</h1>
        <table>
          <tbody>
            <tr>
              <td>
                <h3 style={STYLE.font_family.th}>คำปรึกษา</h3>
              </td>
              <td>
                <p style={STYLE.font_family.th}>เรามีการใช้แนวคิด RAG ( Retrieval-Augmented Generation ) ที่ช่วยในการสืบค้นข้อมูลที่เชื่อถือได้ ทำให้คุณมั่นใจในข้อมูลที่ได้รับ เรามุ่งเน้นให้บริการที่มีประสิทธิภาพและตอบสนองต่อความต้องการของผู้ใช้</p>
              </td>
            </tr>
            <tr>
              <td>
                <h3 style={STYLE.font_family.th}>วิเคราะห์</h3>
              </td>
              <td>
                <p style={STYLE.font_family.th}>เรามีการใช้แนวคิด CoT ( Chain Of Thought ) มาใช้รวมกับ LLM ที่จะช่วยในการวิเคราะห์ข้อมูลเพื่อให้คุณได้ข้อมูลที่ถูกต้อง และประเมินอาการเพื่อให้คำปรึกษาที่เหมาะสม</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
    </div>
  )
}

export default App
