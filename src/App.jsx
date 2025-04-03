import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane, faExpand, faThermometer } from "@fortawesome/free-solid-svg-icons"

import { get_history, get_section, get_notification, get_profile, del_notification, new_section, new_message, new_profile, test_chatbot, test_connect } from "./API"
import THEMES from "./style/Themes"
import LANGUAGES from "./style/Language"
import Toast from './components/Toast'

function App() {
  const [time, setTime] = useState(new Date());
  const [timestamp, setTimeStamp] = useState(new Date());
  const [form, setForm] = useState({})
  const [text, setText] = useState({})
  const [firstMessage, setFirstMessage] = useState({})
  const [message, setMessage] = useState([])
  const [messageDb, setMessageDb] = useState([])
  const [setting, setSetting] = useState({ display: "none" })
  const [style, setStyle] = useState(false)
  const [platform, setPlatform] = useState(localStorage.getItem("platform") ? localStorage.getItem("platform") : "window")
  const [language, setLanguage] = useState(localStorage.getItem("language") ? localStorage.getItem("language") : "th")
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
  const [profile, setProfile] = useState({
    sex: "",
    age: "",
    job: ""
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
    if (status == "sucess" && user_id != null) {
      getProfile()
      getSection()
      getHistory()
      return;
    }
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
    const profileStyle = document.getElementById("profile")
    const setting = document.getElementById("setting")
    const exit = document.getElementById("exit")
    profileStyle.className = `profile ${theme}`
    setting.className = `setting ${theme}`
    exit.className = `exit ${theme}`
  }, [theme])

  useEffect(() => {
    const profileStyle = document.getElementById("profile")
    const icon_full = document.getElementById("icon-full")
    if (status == "sucess" && user_id != null) {
      setText({
        setting: LANGUAGES.language[language].setting,
        exit: LANGUAGES.language[language].exit
      })
    } else {
      profileStyle.style.cursor = "not-allowed";
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

  const handleChaneProfile = e => {
    setProfile({
      ...profile,
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

  const getProfile = async () => {
    get_profile(user_id)
      .then((res) => {
        setProfile(res.data[0])
        return;
      })
      .catch((err) => {
        console.log(err);
        return
      })
  }

  const getSection = async () => {
    get_section(user_id)
      .then((res) => {
        if (res.data.length <= 0) {
          const first_ai = document.getElementById("first-ai")
          first_ai.innerHTML = LANGUAGES.language[language].no_chat
          return;
        }
        if (localStorage.getItem("section_id") == null) {
          localStorage.setItem("section_id", res.data[0].id)
          location.reload()
          return;
        }
      })
      .catch((err) => {
        console.log(err);

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
            timestamp: `[${timestamp.toLocaleDateString()}]:[${timestamp.toLocaleTimeString()}]`,
            issue_type: "server",
            user_id: user_id,
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
      if (section_id == null || undefined) {
        new_section(user_id)
          .then((res) => {
            localStorage.setItem("section_id", res.data.section_id)
            new_message(res.data.section_id, form)
              .then((_) => {
                getHistory()
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
                    title: "new_message",
                    description: err.message,
                    severity: "higth",
                    status: "wait",
                  }
                })
                handleTime(10500)
                return;
              })
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
                title: "new_section",
                description: err.message,
                severity: "higth",
                status: "wait",
              }
            })
            handleTime(10500)
            return;
          })
      }
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

  const handleSubmitProfile = async e => {
    e.preventDefault();
    new_profile(user_id, profile)
      .then((_) => {
        window.location.reload()
        return;
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
            timestamp: `[${time.toLocaleDateString()}]:[${time.toLocaleTimeString()}]`,
            issue_type: "server",
            user_id: "non-user",
            title: "new_profile",
            description: err.message,
            severity: "hight",
            status: "wait",
          }
        })
        handleTime(10500)
        return;
      })
  }

  const nextPage = (check) => {
    if (status == "sucess" && user_id != null) {
      if (check == "chat") {
        navigate("/pj-DPUCare/chat")
      } else if (check == "setting") {
        setSetting({ display: "block" })
      } else if (check == "exit") {
        localStorage.removeItem("id")
        localStorage.removeItem("section_id")
        localStorage.removeItem("status")
        location.reload()
      } else if (check == "profile") {
        setStyle(true);
      }
    } else {
      if (check == "chat") {
        localStorage.setItem("language", language)
        navigate("/pj-DPUCare/login")
      } else if (check == "setting") {
        localStorage.setItem("language", language)
        navigate("/pj-DPUCare/login")
      } else if (check == "exit") {
        localStorage.setItem("language", language)
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

  const changeThemeSetting = (check) => {
    switch (check) {
      case "default":
        setTheme("default")
        localStorage.setItem("theme", "default")
        break;
      case "GradeGrey":
        setTheme("GradeGrey")
        localStorage.setItem("theme", "GradeGrey")
        break;
      case "PinkFlavour":
        setTheme("PinkFlavour")
        localStorage.setItem("theme", "PinkFlavour")
        break;
      case "VisionsofGrandeur":
        setTheme("VisionsofGrandeur")
        localStorage.setItem("theme", "VisionsofGrandeur")
        break;
      case "UltraVoilet":
        setTheme("UltraVoilet")
        localStorage.setItem("theme", "UltraVoilet")
        break;
      case "TheBlueLagoon":
        setTheme("TheBlueLagoon")
        localStorage.setItem("theme", "TheBlueLagoon")
        break;
      case "CalmDarya":
        setTheme("CalmDarya")
        localStorage.setItem("theme", "CalmDarya")
        break;
      default:
        setTheme("default")
        localStorage.setItem("theme", "default")
        break;
    }
  }

  const changeLanguageSetting = (check) => {
    switch (check) {
      case "th":
        setLanguage("th")
        localStorage.setItem("language", "th")
        break;
      case "en":
        setLanguage("en")
        localStorage.setItem("language", "en")
        break;
      default:
        setLanguage("th")
        localStorage.setItem("language", "th")
        break;
    }
  }

  const reSetting = () => {
    setTheme("default")
    setLanguage("th")
    localStorage.setItem("theme", "default")
    localStorage.setItem("language", "th")
    window.location.reload()
    return;
  }

  const showBorderStyle = (check) => {
    const man = document.getElementById("manLabel")
    const women = document.getElementById("womenLabel")

    if (check == "man") {
      man.style.border = "2px solid #E0EAFC"
      women.style.border = "none"
    } else if (check == "women") {
      women.style.border = "2px solid #E0EAFC"
      man.style.border = "none"
    }
  }

  return (
    <div className='container home' style={THEMES[platform][theme].background}>
      <div className="content">
        <div className="date-time">
          <h1 style={LANGUAGES.font[language]}>{time.toLocaleTimeString()}</h1>
          <h3 style={LANGUAGES.font[language]}>{time.toDateString()}</h3>
        </div>
        <div className="chat-home">
          <h1 style={LANGUAGES.font[language]} onClick={() => nextPage("chat")}>{LANGUAGES.language[language].chatbot}</h1>
          <div className="mini-icon">
            <h2 className='icon-language' style={LANGUAGES.font[language]} onClick={() => changeLanguage(true)} >{language}</h2>
            <FontAwesomeIcon icon={faThermometer} className='icon-theme' onClick={() => changeTheme(true)} />
            <FontAwesomeIcon icon={faExpand} className='icon-full' id='icon-full' onClick={() => nextPage("chat")} />
          </div>
          <div className="show-message">
            <div className='ai'>
              <p className='ai-message' id='first-ai' style={LANGUAGES.font[language]}>{(status == "sucess" && user_id != null) ? firstMessage.answer : LANGUAGES.language[language].first_message}</p>
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
          <h1 style={LANGUAGES.font[language]} className='header-setting'>{LANGUAGES.language[language].setting}</h1>
          <div className="label-theme">
            <h1 style={LANGUAGES.font[language]} onClick={() => setTheme("default")}>{LANGUAGES.language[language].theme}</h1>
            <div className="theme">
              <div className='theme-default' style={LANGUAGES.font[language]} onClick={() => changeThemeSetting("default")}>Default</div>
              <div className='theme-GradeGrey' style={LANGUAGES.font[language]} onClick={() => changeThemeSetting("GradeGrey")}>GradeGrey</div>
              <div className='theme-PinkFlavour' style={LANGUAGES.font[language]} onClick={() => changeThemeSetting("PinkFlavour")}>PinkFlavour</div>
              <div className='theme-VisionsofGrandeur' style={LANGUAGES.font[language]} onClick={() => changeThemeSetting("VisionsofGrandeur")}>VisionsofGrandeur</div>
              <div className='theme-UltraVoilet' style={LANGUAGES.font[language]} onClick={() => changeThemeSetting("UltraVoilet")}>UltraVoilet</div>
              <div className='theme-TheBlueLagoon' style={LANGUAGES.font[language]} onClick={() => changeThemeSetting("TheBlueLagoon")}>TheBlueLagoon</div>
              <div className='theme-CalmDarya' style={LANGUAGES.font[language]} onClick={() => changeThemeSetting("CalmDarya")}>CalmDarya</div>
            </div>
          </div>
          <div className="label-language">
            <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language[language].language}</h1>
            <div className="language">
              <div className='lang' style={LANGUAGES.font[language]} onClick={() => changeLanguageSetting("th")}>{LANGUAGES.language[language].th}</div>
              <div className='lang' style={LANGUAGES.font[language]} onClick={() => changeLanguageSetting("en")}>{LANGUAGES.language[language].en}</div>
            </div>
          </div>
          <div className="btn-2">
            <button onClick={() => reSetting()}>{LANGUAGES.language[language].resetting}</button>
            <button onClick={() => setSetting({ display: "none" })}>{LANGUAGES.language[language].save}</button>
          </div>
        </div>
        <div className="show-profile" style={style ? { display: "flex" } : { display: "none" }}>
          <form onSubmit={handleSubmitProfile}>
            <h1 style={LANGUAGES.font[language]} className='header-profile'>{LANGUAGES.language[language].profile}</h1>
            <div className="label-sex">
              <h1 className='h1-sex' style={LANGUAGES.font[language]}>{LANGUAGES.language[language].sex}</h1>
              <div className="sex">
                <label htmlFor="manId" id='manLabel' style={LANGUAGES.font[language]} onClick={() => showBorderStyle("man")}>{LANGUAGES.language[language].man}</label>
                <input type="radio" id="manId" name="sex" value={"man"} onChange={(e) => handleChaneProfile(e)} />
                <label htmlFor="womenId" id='womenLabel' style={LANGUAGES.font[language]} onClick={() => showBorderStyle("women")}>{LANGUAGES.language[language].women}</label>
                <input type="radio" id='womenId' name="sex" value={"women"} onChange={(e) => handleChaneProfile(e)} />
              </div>
            </div>
            <div className="label-age">
              <h1 className='h1-age' style={LANGUAGES.font[language]}>{LANGUAGES.language[language].age}</h1>
              <input type="number" min={1} value={profile.age} name="age" style={LANGUAGES.font[language]} placeholder={LANGUAGES.language[language].number} onChange={(e) => handleChaneProfile(e)} />
            </div>
            <div className="label-job">
              <h1 className='h1-job' style={LANGUAGES.font[language]}>{LANGUAGES.language[language].occupation}</h1>
              <select name="job" className='job' defaultValue="non" onChange={(e) => handleChaneProfile(e)}>
                <option value="non">{LANGUAGES.language[language].please_select}</option>
                <option value="student">{LANGUAGES.language[language].occupations.student}</option>
                <option value="teacher">{LANGUAGES.language[language].occupations.teacher}</option>
              </select>
            </div>
            <div className="btn-2">
              <button onClick={() => setStyle(false)}>{LANGUAGES.language[language].cancel}</button>
              <button type='submit'>{LANGUAGES.language[language].save}</button>
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