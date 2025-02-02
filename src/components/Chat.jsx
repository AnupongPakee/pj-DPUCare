import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome, faRightToBracket, faTrash, faMessage, faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

import STYLE from "../style/Style"

function Chat() {
  const navigate = useNavigate()

  let state = 0
  const showSlideLeft = check => {
    const slide_left = document.getElementById("slide-left")

    if (check) {
      state += 1
    }

    if (state == 1) {
      slide_left.style.display = "none"
    }
    else if (state == 2) {
      slide_left.style.display = "block"
      state = 0
    }
  }

  let state_2 = 0
  const showOption = check => {
    const option_moblie = document.getElementById("option-moblie")
    if (check) {
      state_2 += 1
    }

    if (state_2 == 1) {
      option_moblie.style.display = "block"
    }

    else if (state_2 == 2) {
      option_moblie.style.display = "none"
      state_2 = 0
    }
  }
  return (
    <div className='container chat' style={STYLE.container}>
      <div className="content">
        <div className="silde-left" id='slide-left'>
          <button style={STYLE.font_family.th}>เพิ่มแชทใหม่</button>
          <div className="line"></div>
          <div className="history">
            <div className="name-icon">
              <p style={STYLE.font_family.th}>แชทแรกพบแต่รักแรกเจอ</p>
              <FontAwesomeIcon icon={faTrash} className='icon-delete' />
            </div>
          </div>
          <div className="line"></div>
          <div className="mini-menu">
            <FontAwesomeIcon icon={faHome} className='icon-mini' title='กลับไปหน้าแรก' onClick={() => navigate("/pj-DPUCare")} />
            <FontAwesomeIcon icon={faRightToBracket} className='icon-mini' title='ออกจากระบบ' />
          </div>
        </div>
        <div className="menu-moblie">
          <FontAwesomeIcon icon={faPlus} className='icon-moblie' />
          <FontAwesomeIcon icon={faMessage} className='icon-moblie' onClick={() => showOption(true)} />
          <FontAwesomeIcon icon={faHome} className='icon-moblie' onClick={() => navigate("/pj-DPUCare/")} />
          <FontAwesomeIcon icon={faRightToBracket} className='icon-moblie' />
        </div>
        <div className="silde-right">
          <div className="resizer" onClick={() => showSlideLeft(true)}></div>
          <div className="show-message">
            <div className="st-message">
              <p className='ai-message'>สวัสดีค่ะ</p>
            </div>
            <div className="message">
              <div className="h-message">
                <p className='human-message'>ผมคือพระเจ้า</p>
              </div>
              <div className="a-message">
                <p className='ai-message'>สวัสดีค่ะ</p>
              </div>
            </div>
          </div>
          <div className="input">
            <form action="">
              <input type="text" placeholder='ป้อนคำถาม' style={STYLE.font_family.th} />
              <FontAwesomeIcon icon={faPaperPlane} className='icon-send' />
            </form>
            <button style={STYLE.font_family.th}>ประเมิน</button>
          </div>
          <div className="warning">
            <p style={STYLE.font_family.th}>DPU Care อาจทำผิดพลาดได้ ดังนั้นโปรดตรวจสอบคำตอบอีกครั้ง</p>
          </div>
        </div>
      </div>
      <div className="option-moblie" id='option-moblie'>
        <div className="nav-menu">
          <h1 style={STYLE.font_family.th}>ประวัติแชท</h1>
          <FontAwesomeIcon icon={faRightToBracket} className='icon-exit' onClick={() => showOption(true)} />
        </div>
        <div className="line"></div>
        <div className="history">
          <div className="name-icon">
            <p style={STYLE.font_family.th}>แชทแรกพบแต่รักแรกเจอ</p>
            <FontAwesomeIcon icon={faTrash} className='icon-delete' />
          </div>
        </div>
        <div className="line"></div>
      </div>
      <div className="not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
    </div>
  )
}

export default Chat