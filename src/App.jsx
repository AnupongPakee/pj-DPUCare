import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faExpand } from "@fortawesome/free-solid-svg-icons"
import axios from 'axios'

import STYLE from "./style/Style"

function App() {
  const URL = "http://127.0.0.1:8000"
  const [time, setTime] = useState(new Date());
  const [form, setForm] = useState({})
  const [text, setText] = useState({})
  const [message, setMessage] = useState([])
  const navigate = useNavigate()
  const messageEndRef = useRef(null);

  const status = localStorage.getItem("status")
  const user_id = localStorage.getItem("id")
  const section_id = localStorage.getItem("section")

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000)
    if (status == "sucess" && user_id != null) {
      setText({
        setting: "การต้้งค่า",
        exit: "ออก"
      })
    } else {
      setText({
        setting: "เข้าสู่ระบบ",
        exit: "สร้างบัญชี"
      })
    }
    getHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [message])

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  const getHistory = async () => {
    await axios.get(URL + "/history/" + section_id)
      .then((res) => {
        console.log(res);
      }).catch((err) => console.log(err))
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
    if (message.length >= 3) {
      localStorage.setItem("limit", 0)
    }
    if (localStorage.getItem("limit", 0)) {
      setMessage([...message, {
        question: form.question,
        answer: "คุณใช้จำนวนคำถามที่มีอยู่หมดแล้ว กรุณาสร้างบัญชีหรือเข้าสู่ระบบเพื่อดำเนินการสนทนาต่อ"
      }])
    } else {
      await axios.post(URL + "/history", form)
        .then((res) => {
          setMessage([...message, {
            question: form.question,
            answer: res.data.answer
          }])
          scrollToBottom()
        })
        .catch((err) => console.log(err))
    }
  }

  const nextPage = (check) => {
    if (status == "sucess" && user_id != null) {
      if (check == "chat") {
        navigate("/pj-DPUCare/chat")
      } else if (check == "setting") {
        console.log("setting");
      } else if (check == "exit") {
        localStorage.clear()
        location.reload()
      }
    } else {
      if (check == "chat") {
        navigate("/pj-DPUCare/login")
      } else if (check == "setting") {
        navigate("/pj-DPUCare/login")
      } else if (check == "exit") {
        navigate("/pj-DPUCare/register")
      }
    }
  }

  return (
    <div className='container home' style={STYLE.container}>
      <div className="content">
        <div className="date-time">
          <h1 style={STYLE.font_family.en}>{time.toLocaleTimeString()}</h1>
          <h3 style={STYLE.font_family.en}>{time.toDateString()}</h3>
        </div>
        <div className="chat">
          <h1 style={STYLE.font_family.th} onClick={() => nextPage("chat")}>แชทบอท</h1>
          <div className="show-message">
            <FontAwesomeIcon icon={faExpand} className='icon-full' onClick={() => nextPage("chat")} />
            <div className='ai'>
              <p className='ai-message' style={STYLE.font_family.th}>สวัสดีค่ะ หากคุณต้องการพูดคุยหรือระบายความรู้สึก ฉันอยู่ที่นี่เพื่อรับฟังและช่วยแนะนำวิธีผ่อนคลายให้คุณนะค่ะ</p>
            </div>
            {
              message.map((item, idx) => {
                return (
                  <div key={idx}>
                    <div className='human'>
                      <p className='human-message' style={STYLE.font_family.th}>{item.question}</p>
                    </div>
                    <div className='ai'>
                      <p className='ai-message' style={STYLE.font_family.th}>{item.answer}</p>
                    </div>
                  </div>
                )
              })
            }
            <div ref={messageEndRef} />
          </div>
          <form onSubmit={handleSubmit}>
            <input type="text" name='question' id='question' placeholder='ป้อนคำถาม ?' style={STYLE.font_family.th} onChange={(e) => handleChange(e)} />
            <button type="submit">
              <FontAwesomeIcon icon={faPaperPlane} className='icon-send' />
            </button>
          </form>
        </div>
        <div className="logo">
          <h1 style={STYLE.font_family.en}>DPU Care</h1>
        </div>
        <div className="setting" style={STYLE.font_family.th} onClick={() => nextPage("setting")}>
          {text.setting}
        </div>
        <div className="CoT">
          <h1>วิเคราะห์</h1>
        </div>
        <div className="exit" style={STYLE.font_family.th} onClick={() => nextPage("exit")}>{text.exit}</div>
      </div>
      <div className="not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
    </div>
  )
}

export default App