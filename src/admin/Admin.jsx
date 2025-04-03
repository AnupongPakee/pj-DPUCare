import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"

import THEMES from "../style/Themes"
import LANGUAGES from "../style/Language"
import Toast from '../components/Toast'

function Admin() {
  const [time, setTime] = useState(new Date());
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

  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000)
  }, [])
  return (
    <div className='container admin' style={THEMES[platform][theme].background}>
      <div className="content">
        <div className="date-time">
          <h1 style={LANGUAGES.font[language]}>{time.toLocaleTimeString()}</h1>
          <h3 style={LANGUAGES.font[language]}>{time.toDateString()}</h3>
        </div>
        <div className="data">
          <h1 style={LANGUAGES.font[language]}>data</h1>
        </div>
        <div className="chat-admin">
          <form action="">
            <input type="text" placeholder='ป้อนคำคาม' />
          </form>
        </div>
        <div className="prompt-templete">
          <form action="">
            <input type="text" value={"prompt templete"} style={LANGUAGES.font[language]} />
          </form>
        </div>
        <div className="logo">
          <h1 style={LANGUAGES.font[language]}>Admin</h1>
        </div>
        <div className="token-calculator">
          <h3 style={LANGUAGES.font[language]}>40,5000 token</h3>
        </div>
        <div className="test">
          <h1 style={LANGUAGES.font[language]}>report</h1>
        </div>
        <div className="exit" style={LANGUAGES.font[language]}>
          exit
        </div>
      </div>
      <div className="admin-not-support">
        <h1 style={LANGUAGES.font[language]}>Not Support</h1>
      </div>
    </div>
  )
}

export default Admin