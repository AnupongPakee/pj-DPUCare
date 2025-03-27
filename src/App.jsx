import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faExpand } from "@fortawesome/free-solid-svg-icons"
import axios from 'axios'

import STYLE from "./style/Style"
import THEMES from "./style/Themes"
import { get_history, get_section, new_message, test_connect } from "./API"
import Toast from './components/Toast'

function App() {
  const [time, setTime] = useState(new Date());
  const [form, setForm] = useState({})
  const [text, setText] = useState({})
  const [firstMessage, setFirstMessage] = useState({})
  const [message, setMessage] = useState([])
  const [messageDb, setMessageDb] = useState([])
  const [setting, setSetting] = useState({display: "none"})
  const [theme, setTheme] = useState("default")
  const [toast, setToast] = useState({ "show": "false", "theme": "default" })
  const navigate = useNavigate()
  const messageEndRef = useRef(null);

  const status = localStorage.getItem("status")
  const user_id = localStorage.getItem("id")
  const section_id = localStorage.getItem("section")

  useEffect(() => {
    test_connect()
      .then((_) => {
        console.log("connect: success");
      }).catch((err) => {
        console.log(err);
        setToast({
          "show": true,
          "status": "mistake",
          "text": "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองอีกครั้งในภายหลัง",
          "font": "th",
          "duration": 3000,
          "theme": theme
        })
      })
    setInterval(() => setTime(new Date()), 1000)
    if (status == "sucess" && user_id != null) {
      setText({
        setting: "การต้้งค่า",
        exit: "ออก"
      })
      setToast({
        "show": "true",
        "status": "success",
        "text": "คุณเข้าสู่ระบบเรียบร้อยแล้ว ขอให้สนุกกับการใช้งาน 😊",
        "reload": "false"
      })
      setTimeout(() => {
        setToast({ "show": "false" })
      }, 4500);
    } else {
      setText({
        setting: "เข้าสู่ระบบ",
        exit: "สร้างบัญชี"
      })
    }
    getHistory()
    getSection()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [message, messageDb])

  const handleChange = e => {
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
        setMessageDb(res.data.secondChatAll)
      }).catch((err) => console.log(err))
  }

  const getSection = async () => {
    get_section(user_id)
      .then((res) => {
        if (localStorage.getItem("section") == null) {
          localStorage.setItem("section", res.data[0].id)
          location.reload()
        }
      })
      .catch((err) => console.log(err))
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const text = document.getElementById("question");
    text.value = "";
    const rawMessage = {
      question: form.question,
      answer: "กำลังพิมพ์..."
    }
    if (status == "sucess" && user_id != null) {
      setMessageDb([...messageDb, rawMessage])
      new_message(section_id, form)
        .then((res) => {
          console.log(res);
          scrollToBottom()
          getHistory()
        })
        .catch((err) => console.log(err))
    } else {
      setMessage([...message, rawMessage])
      if (message.length >= 5) {
        localStorage.setItem("limit", 0)
      }
      if (localStorage.getItem("limit", 0)) {
        setMessage([...message, {
          question: form.question,
          answer: "คุณใช้จำนวนคำถามที่มีอยู่หมดแล้ว กรุณาสร้างบัญชีหรือเข้าสู่ระบบเพื่อดำเนินการสนทนาต่อ"
        }])
      } else {
        await axios.post(import.meta.env.VITE_API + "/history", form)
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
  }

  const nextPage = (check) => {
    if (status == "sucess" && user_id != null) {
      if (check == "chat") {
        navigate("/pj-DPUCare/chat")
      } else if (check == "setting") {
        setSetting({display: "block"})
      } else if (check == "exit") {
        localStorage.clear()
        location.reload()
      } else if (check == "profile") {

      }
    } else {
      if (check == "chat") {
        navigate("/pj-DPUCare/login")
      } else if (check == "setting") {
        navigate("/pj-DPUCare/login")
      } else if (check == "exit") {
        navigate("/pj-DPUCare/register")
      } else if (check == "profile") {
        navigate("/pj-DPUCare/register")
      }
    }
  }

  return (
    <div className='container home' style={THEMES[theme].background}>
      <div className="content">
        <div className="date-time">
          <h1 style={STYLE.font_family.en}>{time.toLocaleTimeString()}</h1>
          <h3 style={STYLE.font_family.en}>{time.toDateString()}</h3>
        </div>
        <div className="chat-home">
          <h1 style={STYLE.font_family.th} onClick={() => nextPage("chat")}>แชทบอท</h1>
          <div className="show-message">
            <FontAwesomeIcon icon={faExpand} className='icon-full' onClick={() => nextPage("chat")} />
            <div className='ai'>
              <p className='ai-message' style={STYLE.font_family.th}>{(status == "sucess" && user_id != null) ? firstMessage.answer : "สวัสดีค่ะ หากคุณต้องการพูดคุยหรือระบายความรู้สึก ฉันอยู่ที่นี่เพื่อรับฟังและช่วยแนะนำวิธีผ่อนคลายให้คุณนะค่ะ"}</p>
            </div>
            {
              (status == "sucess" && user_id != null) ? messageDb.map((item, idx) => {
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
              }) : message.map((item, idx) => {
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
          <h1 style={STYLE.font_family.en}>DPU CARE</h1>
        </div>
        <div className="setting" style={STYLE.font_family.th} onClick={() => nextPage("setting")}>
          {text.setting}
        </div>
        <div className="show-setting" style={setting}>
          <form>
            <h1 style={STYLE.font_family.th} className='header-setting'>การต้้งค่า</h1>
            <div className="label-theme">
              <h1 style={STYLE.font_family.th}>ธีม</h1>
              <div className="theme">
                <label htmlFor="default" className='theme-default' style={STYLE.font_family.en} onClick={() => setTheme("default")}>Default</label>
                <input type="checkbox" name="theme" value={"default"} id="default" />
              </div>
            </div>
            <div className="label-language">
              <h1 style={STYLE.font_family.th}>ภาษา</h1>
              <div className="language">
                <select name="language" defaultValue={"thai"}>
                  <option value="thai">ไทย</option>
                  <option value="eng">อังกฤษ</option>
                </select>
              </div>
            </div>
            <div className="btn-2">
              <button onClick={() => setSetting({display: "none"})}>ยกเลิก</button>
              <button type="submit">ยืนยัน</button>
            </div>
          </form>
        </div>
        <div className="profile" style={STYLE.font_family.th} onClick={() => nextPage("profile")}>
          <h1>โปรไฟล์</h1>
        </div>
        <div className="exit" style={STYLE.font_family.th} onClick={() => nextPage("exit")}>{text.exit}</div>
      </div>
      <div className="not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
      <Toast data={toast}></Toast>
    </div>
  )
}

export default App