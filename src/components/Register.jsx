import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"

import { register, new_profile, new_section, new_message, test_connect } from "../API"
import THEMES from "../style/Themes"
import LANGUAGES from "../style/Language"
import Toast from './Toast'

function Register() {
  const [timestamp, setTimeStamp] = useState(new Date());
  const [user, setUser] = useState({})
  const [profile, setProfile] = useState({})
  const [style, setStyle] = useState(false)
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
    const btn = document.getElementById("btn")
    const lb_sex = document.getElementById("h1-sex")
    const lb_age = document.getElementById("h1-age")
    const lb_job = document.getElementById("h1-job")
    btn.className = `btn-rgs ${theme}`
    lb_sex.className = `h1-sex ${theme}`
    lb_age.className = `h1-age ${theme}`
    lb_job.className = `h1-job ${theme}`
  }, [])

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeProfile = (e) => {
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user || Object.keys(user).length === 0) {
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
    }
    if (user.password_confirm != user.password) {
      setToast({
        "show": true,
        "status": "warn",
        "text": LANGUAGES.language[language].warn.password,
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
      register(user)
        .then((res) => {
          setToast({
            "show": true,
            "status": "success",
            "text": LANGUAGES.language[language].warn.success_register,
            "icon": false,
            "font": language,
            "flag": false,
            "duration": 5000,
            "drive": platform,
            "theme": theme
          })
          handleTime(5500)
          localStorage.setItem("id", res.data.id)
          localStorage.setItem("status", "sucess")
          new_section(res.data.id)
            .then((res) => {
              localStorage.setItem("section_id", res.data.section_id)
              new_message(res.data.section_id, { "question": "สวัสดี" })
                .then((_) => {
                  setStyle(true)
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
                      title: "new_message",
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
                  issue_type: "server",
                  user_id: "non-user",
                  title: "new_section",
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
          console.log(err);
          if (err.response.data.detail == "user already exists") {
            setToast({
              "show": true,
              "status": "warn",
              "text": LANGUAGES.language[language].warn.user_already,
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
          else if (err.response.data.detail == "email already exists") {
            setToast({
              "show": true,
              "status": "warn",
              "text": LANGUAGES.language[language].warn.email_already,
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
                issue_type: "server",
                user_id: "non-user",
                title: "register",
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

  const handleSubmitProfile = async e => {
    e.preventDefault();
    new_profile(localStorage.getItem("id"), profile)
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
    <div className='container register' style={THEMES[platform][theme].background}>
      <div className="content" id='content-rgs'>
        <div className="left">
          <form onSubmit={handleSubmit} id='form'>
            <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language[language].register}</h1>
            <input type="text" name='username' style={LANGUAGES.font[language]} placeholder={LANGUAGES.language[language].username} onChange={(e) => handleChange(e)} />
            <input type="email" name='email' style={LANGUAGES.font[language]} placeholder={LANGUAGES.language[language].email} onChange={(e) => handleChange(e)} /> <br />
            <input type="password" name='password' id='password' style={LANGUAGES.font[language]} placeholder={LANGUAGES.language[language].password} onChange={(e) => handleChange(e)} />
            <input type="password" name='password_confirm' style={LANGUAGES.font[language]} placeholder={LANGUAGES.language[language].password_confirm} onChange={(e) => handleChange(e)} /> <br />
            <button id='btn' className='btn-rgs' type="submit">{LANGUAGES.language[language].create_account}</button>
          </form>
        </div>
        <img src="images/lgn_rgs.jpg" alt="images" />
      </div>
      <div className="new-profile" style={style ? THEMES[platform][theme].background : {display: "none"}}>
        <form onSubmit={handleSubmitProfile}>
          <h1 style={LANGUAGES.font[language]} className='header-profile'>{LANGUAGES.language[language].profile}</h1>
          <div className="label-sex">
            <h1 id='h1-sex' className='h1-sex' style={LANGUAGES.font[language]}>{LANGUAGES.language[language].sex}</h1>
            <div className="sex">
              <label htmlFor="manId" id='manLabel' style={LANGUAGES.font[language]} onClick={() => showBorderStyle("man")}>{LANGUAGES.language[language].man}</label>
              <input type="radio" id="manId" name="sex" value={"man"} onChange={(e) => handleChangeProfile(e)} />
              <label htmlFor="womenId" id='womenLabel' style={LANGUAGES.font[language]} onClick={() => showBorderStyle("women")}>{LANGUAGES.language[language].women}</label>
              <input type="radio" id='womenId' name="sex" value={"women"} onChange={(e) => handleChangeProfile(e)} />
            </div>
          </div>
          <div className="label-age">
            <h1 id='h1-age' className='h1-age' style={LANGUAGES.font[language]}>{LANGUAGES.language[language].age}</h1>
            <input type="number" min={1} name="age" style={LANGUAGES.font[language]} placeholder={LANGUAGES.language[language].number} onChange={(e) => handleChangeProfile(e)} />
          </div>
          <div className="label-job">
            <h1 id='h1-job' className='h1-job' style={LANGUAGES.font[language]}>{LANGUAGES.language[language].occupation}</h1>
            <select name="job" className='job' defaultValue={"non"} onChange={(e) => handleChangeProfile(e)}>
              <option value="non">{LANGUAGES.language[language].please_select}</option>
              <option value="student">{LANGUAGES.language[language].occupations.student}</option>
              <option value="teacher">{LANGUAGES.language[language].occupations.teacher}</option>
            </select>
          </div>
          <div className="btn-2">
            <button onClick={() => navigate("/pj-DPUCare")}>{LANGUAGES.language[language].skip}</button>
            <button type='submit'>{LANGUAGES.language[language].save}</button>
          </div>
        </form>
      </div>
      <div className="not-support">
        <h1 style={LANGUAGES.font[language]}>{LANGUAGES.language[language].not_support}</h1>
      </div>
      <Toast data={toast} />
    </div>
  )
}

export default Register