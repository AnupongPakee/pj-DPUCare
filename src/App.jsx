import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faExpand, faThermometer } from "@fortawesome/free-solid-svg-icons"

import { get_history, get_section, get_notification, del_notification, new_message, test_chatbot, test_connect } from "./API"
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
  const [platform, setPlatform] = useState(localStorage.getItem("platform") ? localStorage.getItem("platform") : "window")
  const [language, setLanguage] = useState(localStorage.getItem("language") ? localStorage.getItem("language") : "en")
  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "default")
  const [stateLanguage, setStateLanguage] = useState(0);
  const [stateTheme, setStateTheme] = useState(0);
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
  const currentDate = new Date()

  const status = localStorage.getItem("status")
  const user_id = localStorage.getItem("id")
  const section_id = localStorage.getItem("section_id")

  useEffect(() => {
    if (window.screen.width < 1280) {
      localStorage.setItem("platform", "phone")
    } else {
      localStorage.setItem("platform", "window")
    }
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
    setInterval(() => setTime(new Date()), 1000)
    get_notification()
      .then((res) => {
        if (res.data.length > 0) {
          if (`${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}` != res.data[0].timestamp) {
            setToast({
              "show": true,
              "status": "admin",
              "text": (language == "en" ? res.data[0].notification_en : res.data[0].notification_th),
              "icon": false,
              "font": language,
              "flag": false,
              "duration": 5000,
              "drive": platform,
              "theme": theme
            })
            handleTime(5500)
            return;
          } else {
            del_notification(res.data[0].id)
              .then((_) => {
                return;
              })
              .catch((err) => {
                console.log(err);
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
                    timestamp: `[${timestamp.toLocaleDateString()}]:[${timestamp.toLocaleTimeString()}]`,
                    issue_type: "server",
                    user_id: "non-user",
                    title: "del_notification",
                    description: err.message,
                    severity: "medium",
                    status: "wait",
                  }
                })
                handleTime(10500)
                return;
              })
          }
        }
        else {
          return;
        }
      })
      .catch((err) => {
        console.log(err);
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
            timestamp: `[${timestamp.toLocaleDateString()}]:[${timestamp.toLocaleTimeString()}]`,
            issue_type: "server",
            user_id: "non-user",
            title: "get_notification",
            description: err.message,
            severity: "medium",
            status: "wait",
          }
        })
        handleTime(10500)
        return;
      })
  }, [])

  useEffect(() => {
    const profile = document.getElementById("profile")
    const setting = document.getElementById("setting")
    const exit = document.getElementById("exit")
    profile.className = `profile ${theme}`
    setting.className = `setting ${theme}`
    exit.className = `exit ${theme}`
  }, [theme])

  useEffect(() => {
    const icon_full = document.getElementById("icon-full")
    if (status == "sucess" && user_id != null) {
      setText({
        setting: LANGUAGES.language[language].setting,
        exit: LANGUAGES.language[language].exit
      })
      getHistory()
      getSection()
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
      }).catch((err) => {
        console.log(err);
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
            timestamp: `[${timestamp.toLocaleDateString()}]:[${timestamp.toLocaleTimeString()}]`,
            issue_type: "server",
            user_id: "non-user",
            title: "get_history",
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
    get_section(user_id)
      .then((res) => {
        if (localStorage.getItem("section_id") == null) {
          localStorage.setItem("section_id", res.data[0].id)
          location.reload()
        }
      })
      .catch((err) => {
        console.log(err);
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
            timestamp: `[${timestamp.toLocaleDateString()}]:[${timestamp.toLocaleTimeString()}]`,
            issue_type: "server",
            user_id: "non-user",
            title: "get_section",
            description: err.message,
            severity: "medium",
            status: "wait",
          }
        })
        handleTime(10500)
        return;
      })
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const text = document.getElementById("question");
    text.value = "";
    const rawMessage = {
      question: form.question,
      answer: LANGUAGES.language[language].typing
    }
    if (status == "sucess" && user_id != null) {
      setMessageDb([...messageDb, rawMessage])
      new_message(section_id, form)
        .then((_) => {
          scrollToBottom()
          getHistory()
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
              timestamp: `[${timestamp.toLocaleDateString()}]:[${timestamp.toLocaleTimeString()}]`,
              issue_type: "server",
              user_id: "non-user",
              title: "new_message",
              description: err.message,
              severity: "hight",
              status: "wait",
            }
          })
          handleTime(10500)
          return;
        })
    } else {
      setMessage([...message, rawMessage])
      if (message.length >= 5) {
        localStorage.setItem("limit", 0)
      }
      if (localStorage.getItem("limit", 0)) {
        setMessage([...message, {
          question: form.question,
          answer: LANGUAGES.language[language].limit
        }])
      } else {
        test_chatbot(form)
          .then((res) => {
            setMessage([...message, {
              question: form.question,
              answer: res.data.answer
            }])
            scrollToBottom()
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
                timestamp: `[${timestamp.toLocaleDateString()}]:[${timestamp.toLocaleTimeString()}]`,
                issue_type: "server",
                user_id: "non-user",
                title: "test_chatbot",
                description: err.message,
                severity: "hight",
                status: "wait",
              }
            })
            handleTime(10500)
            return;
          })
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

  const changeTheme = (check) => {
    if (check) {
      setStateTheme((prev) => {
        const newState = prev + 1;
        if (newState === 1) {
          setTheme("GradeGrey")
          localStorage.setItem("theme", "GradeGrey")
        };
        if (newState === 2) {
          setTheme("PinkFlavour");
          localStorage.setItem("theme", "PinkFlavour")
        }
        if (newState === 3) {
          setTheme("VisionsofGrandeur");
          localStorage.setItem("theme", "VisionsofGrandeur")
        }
        if (newState === 4) {
          setTheme("UltraVoilet");
          localStorage.setItem("theme", "UltraVoilet")
        }
        if (newState === 5) {
          setTheme("TheBlueLagoon");
          localStorage.setItem("theme", "TheBlueLagoon")
        }
        if (newState === 6) {
          setTheme("CalmDarya");
          localStorage.setItem("theme", "CalmDarya")
        }
        if (newState === 7) {
          setTheme("default");
          localStorage.setItem("theme", "default")
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
          <h1 style={LANGUAGES.font[language]}>{time.toLocaleTimeString()}</h1>
          <h3 style={LANGUAGES.font[language]}>{time.toDateString()}</h3>
        </div>
        <div className="chat-home">
          <h1 style={LANGUAGES.font[language]} onClick={() => nextPage("chat")}>{LANGUAGES.language[language].chatbot}</h1>
          <div className="show-message">
            <div className="mini-icon">
              <h2 className='icon-language' style={LANGUAGES.font[language]} onClick={() => changeLanguage(true)} >{language}</h2>
              <FontAwesomeIcon icon={faThermometer} className='icon-theme' onClick={() => changeTheme(true)} />
              <FontAwesomeIcon icon={faExpand} className='icon-full' id='icon-full' onClick={() => nextPage("chat")} />
            </div>
            <div className='ai'>
              <p className='ai-message' style={LANGUAGES.font[language]}>{(status == "sucess" && user_id != null) ? firstMessage.answer : LANGUAGES.language[language].first_message}</p>
            </div>
            {
              (status == "sucess" && user_id != null) ? messageDb.map((item, idx) => {
                return (
                  <div key={idx}>
                    <div className='human'>
                      <p className='human-message' style={LANGUAGES.font[language]}>{item.question}</p>
                    </div>
                    <div className='ai'>
                      <p className='ai-message' style={LANGUAGES.font[language]}>{item.answer}</p>
                    </div>
                  </div>
                )
              }) : message.map((item, idx) => {
                return (
                  <div key={idx}>
                    <div className='human'>
                      <p className='human-message' style={LANGUAGES.font[language]}>{item.question}</p>
                    </div>
                    <div className='ai'>
                      <p className='ai-message' style={LANGUAGES.font[language]}>{item.answer}</p>
                    </div>
                  </div>
                )
              })
            }
            <div ref={messageEndRef} />
          </div>
          <form onSubmit={handleSubmit}>
            <input type="text" name='question' id='question' placeholder={LANGUAGES.language[language].question} style={LANGUAGES.font[language]} onChange={(e) => handleChange(e)} />
            <button type="submit">
              <FontAwesomeIcon icon={faPaperPlane} className='icon-send' />
            </button>
          </form>
        </div>
        <div className="logo">
          <h1 style={LANGUAGES.font[language]}>DPU CARE</h1>
        </div>
        <div className="setting" id='setting' style={LANGUAGES.font[language]} onClick={() => nextPage("setting")}>
          {text.setting}
        </div>
        <div className="show-setting" style={setting}>
          <form>
            <h1 style={LANGUAGES.font[language]} className='header-setting'>{LANGUAGES.language[language].setting}</h1>
            <div className="label-theme">
              <h1 style={LANGUAGES.font[language]}>ธีม</h1>
              <div className="theme">
                <label htmlFor="default" className='theme-default' style={LANGUAGES.font[language]} onClick={() => setTheme("default")}>Default</label>
                <input type="checkbox" name="theme" value={"default"} id="default" />
              </div>
            </div>
            <div className="label-language">
              <h1 style={LANGUAGES.font[language]}>ภาษา</h1>
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
          <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language[language].profile}</h1>
        </div>
        <div className="exit" id='exit' style={LANGUAGES.font[language]} onClick={() => nextPage("exit")}>{text.exit}</div>
      </div>
      <div className="not-support">
        <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language[language].not_support}</h1>
      </div>
      <Toast data={toast}></Toast>
    </div>
  )
}

export default App