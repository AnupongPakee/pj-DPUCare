import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome, faRightToBracket, faTrash, faMessage, faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

import {
  get_history,
  get_section,
  new_section,
  del_section,
  new_message,
  test_connect
} from "../API"
import THEMES from "../style/Themes"
import LANGUAGES from "../style/Language"
import Toast from './Toast'

function Chat() {
  const [form, setForm] = useState({})
  const [firstMessage, setFirstMessage] = useState({})
  const [message, setMessage] = useState([])
  const [section, setSection] = useState([])
  const [platform, setPlatform] = useState(localStorage.getItem("platform") ? localStorage.getItem("platform") : "window")
  const [language, setLanguage] = useState(localStorage.getItem("language") ? localStorage.getItem("language") : "th")
  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "default")
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

  const user_id = localStorage.getItem("id")
  const section_id = localStorage.getItem("section_id")

  useEffect(() => {
    test_connect()
    .then((_) => {
      console.log("connect: success");
      return;
    }).catch((err) => {
      console.log(err);
      setToast({
        "show": true,
        "status": "mistake",
        "text": LANGUAGES.language[language].warn.error_connect,
        "icon": true,
        "font": language,
        "flag": false,
        "duration": 3000,
        "drive": platform,
        "theme": theme
      })
      return;
    })
    const line = document.getElementById("line")
    const line2 = document.getElementById("line2")
    const line3 = document.getElementById("line3")
    const line4 = document.getElementById("line4")
    const resizer = document.getElementById("resizer")
    line.className = `line ${theme}`
    line2.className = `line ${theme}`
    line3.className = `line ${theme}`
    line4.className = `line ${theme}`
    resizer.className = `resizer ${theme}`
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
        return;
      }).catch((err) => {
        console.log(err)
        setToast({
          "show": true,
          "status": "warn",
          "text": LANGUAGES.language[language].warn.error,
          "icon": true,
          "font": language,
          "flag": true,
          "duration": 10000,
          "drive": platform,
          "theme": theme,
          "report": {
            timestamp: `[${time.toLocaleDateString()}]:[${time.toLocaleTimeString()}]`,
            issue_type: "server",
            user_id: "non-user",
            title: "get_history [chat.jsx]",
            description: err.message,
            severity: "medium",
            status: "wait",
          }
        })
        handleTime(10500)
        return;
      })
  }

  const getSection = async () => {
    const non_history = document.getElementById("non-history")
    get_section(user_id)
      .then((res) => {
        if (res.data.length == 0) {
          non_history.style.display = "flex";
        } else {
          non_history.style.display = "none";
          if (localStorage.getItem("section_id") == undefined) {
            localStorage.setItem("section_id", res.data[0].section_id)
            location.reload()
          }
          setSection(res.data)
        }
      })
      .catch((err) => {
        console.log(err)
        setToast({
          "show": true,
          "status": "warn",
          "text": LANGUAGES.language[language].warn.error,
          "icon": true,
          "font": language,
          "flag": true,
          "duration": 10000,
          "drive": platform,
          "theme": theme,
          "report": {
            timestamp: `[${time.toLocaleDateString()}]:[${time.toLocaleTimeString()}]`,
            issue_type: "server",
            user_id: "non-user",
            title: "get_section [chat.jsx]",
            description: err.message,
            severity: "medium",
            status: "wait",
          }
        })
        handleTime(10500)
        return;
      })
  }

  const newSection = async () => {
    new_section(user_id)
      .then(async (res) => {
        getSection()
        localStorage.setItem("section_id", res.data.section_id)
        new_message(res.data.section_id, { "question": "สวัสดี" })
          .then((_) => {
            getHistory()
            location.reload()
            return;
          })
          .catch((err) => {
            console.log(err)
            setToast({
              "show": true,
              "status": "mistake",
              "text": LANGUAGES.language[language].warn.error,
              "icon": true,
              "font": language,
              "flag": true,
              "duration": 10000,
              "drive": platform,
              "theme": theme,
              "report": {
                timestamp: `[${time.toLocaleDateString()}]:[${time.toLocaleTimeString()}]`,
                issue_type: "server",
                user_id: "non-user",
                title: "new_message [chat.jsx]",
                description: err.message,
                severity: "hight",
                status: "wait",
              }
            })
            handleTime(10500)
            return;
          })
      })
      .catch((err) => {
        console.log(err)
        setToast({
          "show": true,
          "status": "warn",
          "text": LANGUAGES.language[language].warn.error,
          "icon": true,
          "font": language,
          "flag": true,
          "duration": 10000,
          "drive": platform,
          "theme": theme,
          "report": {
            timestamp: `[${time.toLocaleDateString()}]:[${time.toLocaleTimeString()}]`,
            issue_type: "server",
            user_id: "non-user",
            title: "new_section [chat.jsx]",
            description: err.message,
            severity: "hight",
            status: "wait",
          }
        })
        handleTime(10500)
        return;
      })
  }

  const deleteSection = async id => {
    localStorage.removeItem("section_id")
    del_section(id)
      .then((_) => {
        getSection()
        getHistory()
        return;
      })
      .catch((err) => {
        console.log(err)
        setToast({
          "show": true,
          "status": "mistake",
          "text": LANGUAGES.language[language].warn.error,
          "icon": true,
          "font": language,
          "flag": true,
          "duration": 10000,
          "drive": platform,
          "theme": theme,
          "report": {
            timestamp: `[${time.toLocaleDateString()}]:[${time.toLocaleTimeString()}]`,
            issue_type: "server",
            user_id: "non-user",
            title: "del_section [chat.jsx]",
            description: err.message,
            severity: "hight",
            status: "wait",
          }
        })
        handleTime(10500)
        return;
      })
  }

  const selectSection = (id) => {
    localStorage.setItem("section_id", id)
    location.reload()
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const text = document.getElementById("question");
    text.value = "";
    const rawMessage = {
      question: form.question,
      answer: LANGUAGES.language[language].typing
    }
    setMessage([...message, rawMessage])
    new_message(section_id, form)
      .then((_) => {
        getHistory()
        return;
      })
      .catch((err) => {
        console.log(err)
        setToast({
          "show": true,
          "status": "mistake",
          "text": LANGUAGES.language[language].warn.error,
          "icon": true,
          "font": language,
          "flag": true,
          "duration": 10000,
          "drive": platform,
          "theme": theme,
          "report": {
            timestamp: `[${time.toLocaleDateString()}]:[${time.toLocaleTimeString()}]`,
            issue_type: "server",
            user_id: "non-user",
            title: "main new_message [chat.jsx]",
            description: err.message,
            severity: "hight",
            status: "wait",
          }
        })
        handleTime(10500)
        return;
      })
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
    <div className='container chat' style={THEMES[platform][theme].background}>
      <div className="content">
        <div className="silde-left" id='slide-left'>
          <button style={LANGUAGES.font[language]} onClick={() => newSection()}>{LANGUAGES.language[language].new_chat}</button>
          <div className="line" id='line'></div>
          <div className="history">
            {
              section.map((item, idx) => {
                return (
                  <div className="name-icon" key={idx}>
                    <p style={LANGUAGES.font[language]} onClick={() => selectSection(item.section_id)}>{item.time}</p>
                    <FontAwesomeIcon icon={faTrash} className='icon-delete' onClick={() => deleteSection(item.section_id)} />
                  </div>
                )
              })
            }
          </div>
          <div className="line" id='line2'></div>
          <div className="mini-menu">
            <FontAwesomeIcon icon={faHome} className='icon-mini' title={LANGUAGES.language[language].to_home} onClick={() => navigate("/pj-DPUCare")} />
            <FontAwesomeIcon icon={faRightToBracket} className='icon-mini' title={LANGUAGES.language[language].logout} onClick={() => logout()} />
          </div>
        </div>
        <div className="menu-moblie">
          <FontAwesomeIcon icon={faPlus} className='icon-moblie' onClick={() => newSection()} />
          <FontAwesomeIcon icon={faMessage} className='icon-moblie' onClick={() => showOption(true)} />
          <FontAwesomeIcon icon={faHome} className='icon-moblie' onClick={() => navigate("/pj-DPUCare/")} />
          <FontAwesomeIcon icon={faRightToBracket} className='icon-moblie' onClick={() => logout()} />
        </div>
        <div className="silde-right">
          <div className="resizer" id='resizer' onClick={() => showSlideLeft(true)}></div>
          <div className="non-history" id='non-history'>
            <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language[language].no_chat}</h1>
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
              <input type="text" name='question' id='question' placeholder={LANGUAGES.language[language].question} style={LANGUAGES.font[language]} onChange={(e) => handleChanage(e)} />
              <button type="submit">
                <FontAwesomeIcon icon={faPaperPlane} className='icon-send' />
              </button>
            </form>
          </div>
          <div className="warning">
            <p style={LANGUAGES.font[language]}>{LANGUAGES.language[language].dpu_care}</p>
          </div>
        </div>
      </div>
      <div className="option-moblie" id='option-moblie'>
        <div className="nav-menu">
          <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language[language].chat_history}</h1>
          <FontAwesomeIcon icon={faRightToBracket} className='icon-exit' onClick={() => showOption(true)} />
        </div>
        <div className="line" id='line3'></div>
        <div className="history">
          {
            section.map((item, idx) => {
              return (
                <div className="name-icon" key={idx}>
                  <p style={LANGUAGES.font[language]} onClick={() => selectSection(item.section_id)}>{item.time}</p>
                  <FontAwesomeIcon icon={faTrash} className='icon-delete' onClick={() => deleteSection(item.section_id)} />
                </div>
              )
            })
          }
        </div>
        <div className="line" id='line4'></div>
      </div>
      <div className="not-support">
        <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language[language].not_support}</h1>
      </div>
      <Toast data={toast} />
    </div>
  )
}

export default Chat