import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"

import { login, get_section, test_connect } from "../API"
import STYLE from "../style/Style"
import THEMES from "../style/Themes"
import LANGUAGES from "../style/Language"
import Toast from './Toast'

function Login() {
  const [timestamp, setTimeStamp] = useState(new Date());
  const [form, setForm] = useState({})
  const [platform, setPlatform] = useState("window")
  const [language, setLanguage] = useState(localStorage.getItem("language") ? localStorage.getItem("language") : "th")
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

  useEffect(() => {
    test_connect()
      .then((_) => {
        console.log("connect: success");
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
      })
  }, [])

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

  const handleSubmit = async e => {
    e.preventDefault();
    login(form)
      .then((res) => {
        localStorage.setItem("status", "sucess")
        localStorage.setItem("id", res.data.id)
        get_section(res.data.id)
          .then((res) => {
            localStorage.setItem("section_id", res.data[0].section_id)
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
                issue_type: "server",
                user_id: "non-user",
                title: "get_section",
                description: err.message,
                severity: "hight",
                status: "wait",
              }
            })
            handleTime(10500)
          })
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
              issue_type: "server",
              user_id: "non-user",
              title: "login",
              description: err.message,
              severity: "hight",
              status: "wait",
            }
          })
          handleTime(10500)
        }
      })
  }

  return (
    <div className='container login' style={THEMES[platform][theme].backbround}>
      <div className="content" id='content-lgn'>
        <div className="left"></div>
        <div className="right">
          <form onSubmit={handleSubmit} id='form'>
            <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language[language].login}</h1>
            <input type="text" name='username' style={STYLE.font_family.th} placeholder={LANGUAGES.language[language].user_or_mail} onChange={(e) => handleChange(e)} />
            <input type="password" name='password' id='password' style={STYLE.font_family.th} placeholder={LANGUAGES.language[language].password} onChange={(e) => handleChange(e)} /> <br />
            <button type="submit">{LANGUAGES.language[language].sign_in}</button>
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