import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faExpand, faThermometer } from "@fortawesome/free-solid-svg-icons"
import axios from 'axios'

import { get_history, get_section, new_message, test_connect } from "./API"
import STYLE from "./style/Style"
import THEMES from "./style/Themes"
import LANGUAGES from "./style/Language"
import Toast from './components/Toast'

function App() {
  const [time, setTime] = useState(new Date());
  const [form, setForm] = useState({})
  const [text, setText] = useState({})
  const [firstMessage, setFirstMessage] = useState({})
  const [message, setMessage] = useState([])
  const [messageDb, setMessageDb] = useState([])
  const [setting, setSetting] = useState({ display: "none" })
  const [platform, setPlatform] = useState("window")
  const [language, setLanguage] = useState(localStorage.getItem("language") ? localStorage.getItem("language") : "th")
  const [stateLanguage, setStateLanguage] = useState(0);
  const [theme, setTheme] = useState("default")
  const [toast, setToast] = useState(
    {
      "show": false,
      "status": "warn",
      "text": LANGUAGES.language[language].warn.wait,
      "icon": false,
      "font": language,
      "flag": false,
      "duration": 3000,
      "drive": platform,
      "theme": theme,
      "report": ""
    })
  const navigate = useNavigate()
  const messageEndRef = useRef(null);

  const status = localStorage.getItem("status")
  const user_id = localStorage.getItem("id")
  const section_id = localStorage.getItem("section_id")

  useEffect(() => {
    if (window.screen.width < 1280) {
      setPlatform("phone")
    }
    test_connect()
      .then((_) => {
        console.log("connect: success");
      }).catch((err) => {
        console.log(err);
        setToast({
          "show": true,
          "status": "mistake",
          "text": "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองอีกครั้งในภายหลัง",
          "icon": true,
          "font": "th",
          "flag": false,
          "duration": 3000,
          "drive": platform,
          "theme": theme
        })
      })
    const profile = document.getElementById("profile")
    profile.className = `profile ${theme}`
    setInterval(() => setTime(new Date()), 1000)
    getHistory()
    getSection()
  }, [])

  useEffect(() => {
    const icon_full = document.getElementById("icon-full")
    if (status == "sucess" && user_id != null) {
      setText({
        setting: LANGUAGES.language[language].setting,
        exit: LANGUAGES.language[language].exit
      })
      setToast({
        "show": true,
        "status": "success",
        "text": "คุณเข้าสู่ระบบเรียบร้อยแล้ว ขอให้สนุกกับการใช้งาน 😊",
        "icon": false,
        "font": "th",
        "flag": false,
        "duration": 3000,
        "drive": platform,
        "theme": theme
      })
      handleTime(3500)
    } else {
      profile.style.cursor = "not-allowed";
      icon_full.style.display = "none"
      setText({
        setting: LANGUAGES.language[language].sign_in,
        exit: LANGUAGES.language[language].create_account
      })
    }
  }, [language])

  useEffect(() => {
    scrollToBottom()
  }, [message, messageDb])

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleTime = (second) => {
    setTimeout(() => {
      setToast({ "show": false, "drive": platform, "theme": theme })
    }, second);
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
        if (localStorage.getItem("section_id") == null) {
          localStorage.setItem("section_id", res.data[0].id)
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
        setSetting({ display: "block" })
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
      }
    }
  }

  const changeLanguage = (check) => {
    if (check) {
      setStateLanguage((prev) => {
        const newState = prev + 1;
        if (newState === 1) {
          setLanguage("en")
          localStorage.setItem("language", "en")
        };
        if (newState === 2) {
          setLanguage("th");
          localStorage.setItem("language", "th")
          return 0;
        }
        return newState;
      });
    }
  };

  return (
    <div className='container home' style={THEMES[platform][theme].background}>
      <div className="content">
        <div className="date-time">
          <h1 style={STYLE.font_family.en}>{time.toLocaleTimeString()}</h1>
          <h3 style={STYLE.font_family.en}>{time.toDateString()}</h3>
        </div>
        <div className="chat-home">
          <h1 style={STYLE.font_family.th} onClick={() => nextPage("chat")}>แชทบอท</h1>
          <div className="show-message">
            <div className="mini-icon">
              <h2 className='icon-language' style={LANGUAGES.font[language]} onClick={() => changeLanguage(true)} >{language}</h2>
              <FontAwesomeIcon icon={faThermometer} className='icon-theme' onClick={() => nextPage("chat")} />
              <FontAwesomeIcon icon={faExpand} className='icon-full' id='icon-full' onClick={() => nextPage("chat")} />
            </div>
            <div className='ai'>
              <p className='ai-message' style={STYLE.font_family.th}>{(status == "sucess" && user_id != null) ? firstMessage.answer : LANGUAGES.language[language].first_message}</p>
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
              <button onClick={() => setSetting({ display: "none" })}>ยกเลิก</button>
              <button type="submit">ยืนยัน</button>
            </div>
          </form>
        </div>
        <div className="profile" id='profile' onClick={() => nextPage("profile")}>
          <h1>{LANGUAGES.language[language].profile}</h1>
        </div>
        <div className="exit" style={STYLE.font_family.th} onClick={() => nextPage("exit")}>{text.exit}</div>
      </div>
      <div className="not-support">
        <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language[language].not_support}</h1>
      </div>
      <Toast data={toast}></Toast>
    </div>
  )
}

export default App