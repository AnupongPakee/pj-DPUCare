import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome, faRightToBracket, faTrash, faMessage, faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

import STYLE from "../style/Style"
import THEMES from "../style/Themes"
import { 
  get_history, 
  get_section,
  new_section,
  del_section, 
  new_message,
  test_connect } from "../API"
import Toast from './Toast'

function Chat() {
  const [form, setForm] = useState({})
  const [firstMessage, setFirstMessage] = useState({})
  const [message, setMessage] = useState([])
  const [section, setSection] = useState([])
  const [toast, setToast] = useState({ "show": "false", "theme": "MinnesotaVikings" })
  const navigate = useNavigate()
  const messageEndRef = useRef(null);

  const user_id = localStorage.getItem("id")
  const section_id = localStorage.getItem("section")

  useEffect(() => {
    test_connect()
      .then((_) => {
        console.log("connect: success");
      }).catch((err) => {
        console.log(err);
        setToast({
          "show": "true",
          "status": "mistake",
          "text": "ติดต่อกับฝั่งเซิฟร์เวอร์ไม่สำเร็จ",
          "theme": "MinnesotaVikings",
          "duration": 3000
        })
      })
    getHistory()
    getSection()
  }, [])

  useEffect(() => {
    if (window.screen.width >= 1280) {
      scrollToBottom()
    }
  }, [message])

  const handleChanage = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  const getHistory = async () => {
    get_history(section_id)
      .then((res) => {
        setFirstMessage(res.data.firstChat)
        setMessage(res.data.secondChatAll)
      }).catch((err) => console.log(err))
  }

  const getSection = async () => {
    const non_history = document.getElementById("non-history")
    get_section(user_id)
      .then((res) => {
        if (res.data.length == 0) {
          non_history.style.display = "flex";
        } else {
          non_history.style.display = "none";
          if (localStorage.getItem("section") == null) {
            localStorage.setItem("section", res.data[0].id)
            location.reload()
          }
          setSection(res.data)
        }
      })
      .catch((err) => console.log(err))
  }

  const newSection = async () => {
    new_section(user_id)
      .then(async (res) => {
        getSection()
        localStorage.setItem("section", res.data.id)
        await axios.post(URL + "/history/" + res.data.id, { "question": "สวัสดี" })
          .then((_) => {
            getHistory()
            location.reload()
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))
  }

  const deleteSection = async id => {
    localStorage.removeItem("section")
    del_section(id)
      .then((_) => {
        getSection()
        getHistory()
      })
      .catch((err) => console.log(err))
  }

  const selectSection = (id) => {
    localStorage.setItem("section", id)
    location.reload()
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const text = document.getElementById("question");
    text.value = "";
    const rawMessage = {
      question: form.question,
      answer: "กำลังพิมพ์..."
    }
    setMessage([...message, rawMessage])
    new_message(section_id, form)
      .then((_) => getHistory())
      .catch((err) => console.log(err))
  }

  const logout = () => {
    localStorage.clear()
    navigate("/pj-DPUCare")
  }

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
    <div className='container chat' style={THEMES.MinnesotaVikings.background}>
      <div className="content">
        <div className="silde-left" id='slide-left'>
          <button style={STYLE.font_family.th} onClick={() => newSection()}>เพิ่มแชทใหม่</button>
          <div className="line"></div>
          <div className="history">
            {
              section.map((item, idx) => {
                return (
                  <div className="name-icon" key={idx}>
                    <p style={STYLE.font_family.th} onClick={() => selectSection(item.id)}>{item.name}</p>
                    <FontAwesomeIcon icon={faTrash} className='icon-delete' onClick={() => deleteSection(item.id)} />
                  </div>
                )
              })
            }
          </div>
          <div className="line"></div>
          <div className="mini-menu">
            <FontAwesomeIcon icon={faHome} className='icon-mini' title='กลับไปหน้าแรก' onClick={() => navigate("/pj-DPUCare")} />
            <FontAwesomeIcon icon={faRightToBracket} className='icon-mini' title='ออกจากระบบ' onClick={() => logout()} />
          </div>
        </div>
        <div className="menu-moblie">
          <FontAwesomeIcon icon={faPlus} className='icon-moblie' onClick={() => newSection()} />
          <FontAwesomeIcon icon={faMessage} className='icon-moblie' onClick={() => showOption(true)} />
          <FontAwesomeIcon icon={faHome} className='icon-moblie' onClick={() => navigate("/pj-DPUCare/")} />
          <FontAwesomeIcon icon={faRightToBracket} className='icon-moblie' onClick={() => logout()} />
        </div>
        <div className="silde-right">
          <div className="resizer" onClick={() => showSlideLeft(true)}></div>
          <div className="non-history" id='non-history'>
            <h1 style={STYLE.font_family.th}>ไม่มีประวัติการแชท</h1>
          </div>
          <div className="show-message">
            <div className="st-message">
              <p className='ai-message'>{firstMessage.answer}</p>
            </div>
            {
              message.map((item, idx) => {
                return (
                  <div className="message" key={idx}>
                    <div className="h-message">
                      <p className='human-message'>{item.question}</p>
                    </div>
                    <div className="a-message">
                      <p className='ai-message'>{item.answer}</p>
                    </div>
                  </div>
                )
              })
            }
            <div ref={messageEndRef} />
          </div>
          <div className="input">
            <form onSubmit={handleSubmit}>
              <input type="text" name='question' id='question' placeholder='ป้อนคำถาม ?' style={STYLE.font_family.th} onChange={(e) => handleChanage(e)} />
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
          {
            section.map((item, idx) => {
              return (
                <div className="name-icon" key={idx}>
                  <p style={STYLE.font_family.th} onClick={() => selectSection(item.id)}>{item.name}</p>
                  <FontAwesomeIcon icon={faTrash} className='icon-delete' onClick={() => deleteSection(item.id)} />
                </div>
              )
            })
          }
        </div>
        <div className="line"></div>
      </div>
      <div className="not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
      <Toast data={toast}/>
    </div>
  )
}

export default Chat