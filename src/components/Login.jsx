import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"

import { login, get_section, get_notification, new_section, new_message, del_notification, test_connect } from "../API"
import THEMES from "../style/Themes"
import LANGUAGES from "../style/Language"
import Toast from './Toast'

function Login() {
  const [timestamp, setTimeStamp] = useState(new Date());
  const [form, setForm] = useState({})
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
  const currentDate = new Date()

  const user_id = localStorage.getItem("id")

  const handleTime = (second) => {
    setTimeout(() => {
      setToast({ "show": false, "drive": platform, "theme": theme })
    }, second);
  }

  useEffect(() => {
    const btn = document.getElementById("btn")
    btn.className = `btn-login ${theme}`
    test_connect()
      .then((_) => {
        console.log("connect: success");
        get_notification()
          .then((res) => {
            if (res.data.length > 0) {
              if (`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}` == res.data[0].timestamp) {
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
                        issue_type: err.code,
                        user_id: "null",
                        title: "del_notification [DELETE][Login]",
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
                issue_type: err.code,
                user_id: "null",
                title: "get_notification [GET][Login]",
                description: err.message,
                severity: "medium",
                status: "wait",
              }
            })
            handleTime(10500)
            return;
          })
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
  }, [])

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form || Object.keys(form).length === 0) {
      setToast({
        "show": true,
        "status": "warn",
        "text": LANGUAGES.language[language].warn.require,
        "icon": false,
        "font": language,
        "flag": false,
        "duration": 3000,
        "drive": platform,
        "theme": theme
      })
      handleTime(3500)
      return;
    } else {
      login(form)
        .then((res) => {
          localStorage.setItem("status", "sucess")
          localStorage.setItem("id", res.data.id)
                    
          if (res.data.role == "admin") {
            navigate("/pj-DPUCare/admin")
          } else {
            get_section(res.data.id)
              .then((res) => {
                if (res.data[0] != undefined) {                
                  localStorage.setItem("section_id", res.data[0].section_id)
                  navigate("/pj-DPUCare")
                }
                else {
                  new_section(localStorage.getItem("id"))
                    .then((res) => {
                      localStorage.setItem("section_id", res.data.section_id)
                      new_message(res.data.section_id, { "question": LANGUAGES.language[language].hi })
                        .then((_) => {
                          navigate("/pj-DPUCare")
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
                              issue_type: err.code,
                              user_id: `${user_id}`,
                              title: "new_message [POST][Login]",
                              description: err.message,
                              severity: "hight",
                              status: "wait",
                            }
                          })
                          handleTime(10500)
                          return;
                        })
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
                          issue_type: err.code,
                          user_id: `${user_id}`,
                          title: "new_section [POST][Login]",
                          description: err.message,
                          severity: "hight",
                          status: "wait",
                        }
                      })
                      handleTime(10500)
                      return;
                    })
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
                    issue_type: err.code,
                    user_id: "null",
                    title: "get_section [GET][Login]",
                    description: err.message,
                    severity: "medium",
                    status: "wait",
                  }
                })
                handleTime(10500)
                return;
              })
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data.detail == "user or email not found") {
            setToast({
              "show": true,
              "status": "warn",
              "text": LANGUAGES.language[language].warn.user_found,
              "icon": false,
              "font": language,
              "flag": false,
              "duration": 3000,
              "drive": platform,
              "theme": theme
            })
            handleTime(3500)
            return;
          }
          else if (err.response.data.detail == "password is incorrect") {
            setToast({
              "show": true,
              "status": "warn",
              "text": LANGUAGES.language[language].warn.password_incorrect,
              "icon": false,
              "font": language,
              "flag": false,
              "duration": 3000,
              "drive": platform,
              "theme": theme
            })
            handleTime(3500)
            return;
          } else {
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
                issue_type: err.code,
                user_id: "null",
                title: "login [POST][Login]",
                description: err.message,
                severity: "hight",
                status: "wait",
              }
            })
            handleTime(10500)
            return;
          }
        })
    }
  }

  return (
    <div className='container login' style={THEMES[platform][theme].background}>
      <div className="content" id='content-lgn'>
        <img src="images/lgn_rgs.jpg" alt="images" />
        <div className="right">
          <form onSubmit={handleSubmit} id='form'>
            <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language[language].login}</h1>
            <input type="text" name='username' style={LANGUAGES.font[language]} placeholder={LANGUAGES.language[language].user_or_mail} onChange={(e) => handleChange(e)} />
            <input type="password" name='password' id='password' style={LANGUAGES.font[language]} placeholder={LANGUAGES.language[language].password} onChange={(e) => handleChange(e)} /> <br />
            <button className='btn-login' id='btn' type="submit">{LANGUAGES.language[language].sign_in}</button>
          </form>
        </div>
      </div>
      <div className="not-support">
        <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language.not_support}</h1>
      </div>
      <Toast data={toast} />
    </div>
  )
}

export default Login