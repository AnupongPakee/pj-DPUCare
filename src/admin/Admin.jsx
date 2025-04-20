import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFloppyDisk, faRightToBracket, faExpand, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons"

import { get_information, get_notification, get_report, new_information, create_notification, del_notification, test_connect } from "../API"
import THEMES from "../style/Themes"
import LANGUAGES from "../style/Language"
import Toast from '../components/Toast'

function Admin() {
  const [time, setTime] = useState(new Date());
  const [timestamp, setTimeStamp] = useState(new Date());
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
  const [prompt, setPrompt] = useState({
    prompt_template: ""
  })
  const [tokens, setTokens] = useState({})
  const [notification, setNotification] = useState({
    "timestamp": "",
    "notification_th": "",
    "notification_en": ""
  })
  const [report, setReport] = useState([])
  const [styleNotification, setStyleNotification] = useState({})
  const [showPromptFull, setShowPromptFull] = useState({ display: "none" })
  const [showNotificationFull, setShowNotificationFull] = useState({ display: "none" })
  const [showReportFull, setShowReportFull] = useState({ display: "none" })
  const [viewReport, setViewReport] = useState({ display: "none" })

  const navigate = useNavigate()
  const currentDate = new Date()

  const user_id = localStorage.getItem("id")
  const section_id = localStorage.getItem("section_id")

  const handleTime = (second) => {
    setTimeout(() => {
      setToast({ "show": false, "drive": platform, "theme": theme })
    }, second);
  }

  useEffect(() => {
    test_connect()
      .then((_) => {
        console.log("connect: success");
        // getInformation()
        getNotification()
        getReport()
        return;
      })
      .catch((err) => {
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
  }, [])

  const handlePrompt = e => {
    setPrompt({
      ...prompt,
      [e.target.name]: e.target.value
    })
  }

  const handleNotification = e => {
    setNotification({
      ...notification,
      [e.target.name]: e.target.value
    })
  }

  const getInformation = () => {
    get_information(user_id)
      .then((res) => {
        setPrompt(res.data[0].prompt_template)
        setTokens({
          "prompt_tokens": res.data[0].prompt_tokens,
          "completion_tokens": res.data[0].completion_tokens,
          "total_token": res.data[0].total_token
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
            issue_type: err.code,
            user_id: `${user_id}`,
            title: "get_information [GET][Admin]",
            description: err.message,
            severity: "medium",
            status: "wait",
          }
        })
        handleTime(10500)
        return;
      })
  }

  const getNotification = () => {
    get_notification()
      .then((res) => {
        setNotification(res.data[0])
        setStyleNotification(res.data[0])
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
            user_id: `${user_id}`,
            title: "get_notification [GET][Admin]",
            description: err.message,
            severity: "medium",
            status: "wait",
          }
        })
        handleTime(10500)
        return;
      })
  }

  const getReport = () => {
    get_report()
      .then((res) => {
        setReport(res.data)
        console.log(res.data);

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
            user_id: `${user_id}`,
            title: "get_report [GET][Admin]",
            description: err.message,
            severity: "medium",
            status: "wait",
          }
        })
        handleTime(10500)
        return;
      })
  }

  const handleSubmitPrompt = (e) => {
    new_information(user_id, prompt)
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
            user_id: `${user_id}`,
            title: "new_information [PUT][Admin]",
            description: err.message,
            severity: "medium",
            status: "wait",
          }
        })
        handleTime(10500)
      })
  }

  const isEmptyObject = obj => {
    if (!obj || typeof obj !== 'object') return true;

    return Object.keys(obj).length === 0 || Object.values(obj).every(
      val => val === null || val === undefined || val === ""
    )
  }

  const handleNewDelete = check => {
    if (check) {
      if (isEmptyObject(notification)) {
        setToast({
          "show": true,
          "status": "mistake",
          "text": "Please fill in all information.",
          "icon": false,
          "font": language,
          "flag": false,
          "duration": 3500,
          "drive": platform,
          "theme": theme,
        })
        handleTime(3500)
      } else {
        console.log(notification);
        create_notification(notification)
          .then((_) => {
            window.location.reload()
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
                user_id: `${user_id}`,
                title: "create_notification [POST][Admin]",
                description: err.message,
                severity: "medium",
                status: "wait",
              }
            })
            handleTime(10500)
            return;
          })
      }
    } else {
      del_notification(notification.id)
        .then((_) => {
          window.location.reload()
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
              user_id: `${user_id}`,
              title: "del_notification [DELETE][Admin]",
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

  return (
    <div className='container admin' style={THEMES[platform][theme].background}>
      <div className="content">
        <div className="date-time">
          <h1 style={LANGUAGES.font[language]}>{time.toLocaleTimeString()}</h1>
          <h3 style={LANGUAGES.font[language]}>{time.toDateString()}</h3>
        </div>
        <div className="prompt-templete">
          <form onSubmit={handleSubmitPrompt}>
            <div className="header-prompt">
              <h1 style={LANGUAGES.font[language]}>Prompt Template</h1>
              <div className="icon-2">
                <FontAwesomeIcon icon={faExpand} className='icon' onClick={() => setShowPromptFull({ display: "flex" })} />
                <button type="submit">
                  <FontAwesomeIcon icon={faFloppyDisk} className='icon' />
                </button>
              </div>
            </div>
            <textarea style={LANGUAGES.font[language]} defaultValue={prompt} name="prompt_template" onChange={(e) => handlePrompt(e)}></textarea>
          </form>
        </div>
        <div className="full-prompt-template" style={showPromptFull}>
          <form onSubmit={handleSubmitPrompt}>
            <div className="header-prompt">
              <h1 style={LANGUAGES.font[language]}>Prompt Template</h1>
              <div className="icon-2">
                <button type="submit">
                  <FontAwesomeIcon icon={faFloppyDisk} className='icon' />
                </button>
                <FontAwesomeIcon icon={faRightToBracket} className='icon' onClick={() => setShowPromptFull({ display: "none" })} />
              </div>
            </div>
            <textarea style={LANGUAGES.font[language]} defaultValue={prompt} name="prompt_template" onChange={(e) => handlePrompt(e)}></textarea>
          </form>
        </div>
        <div className="chat-admin">
          <form action="">
            <input type="text" placeholder='ป้อนคำคาม' />
          </form>
        </div>
        <div className="data">
          <h1 style={LANGUAGES.font[language]}>Coming soon !!</h1>
        </div>
        <div className="notification">
          <div className="header-notification">
            <h3 style={LANGUAGES.font[language]}>Notification</h3>
            <div className="icon-2">
              <FontAwesomeIcon icon={faExpand} className='icon' onClick={() => setShowNotificationFull({ display: "flex" })} />
              <button type="submit">
                <FontAwesomeIcon icon={isEmptyObject(styleNotification) ? faPlus : faTrashCan} className='icon' onClick={() => handleNewDelete(isEmptyObject(styleNotification))} />
              </button>
            </div>
          </div>
          <form>
            <label style={LANGUAGES.font[language]}>End Date: </label>
            <input type="date" name='timestamp' value={isEmptyObject(notification) ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, 0)}-${String(currentDate.getDate()).padStart(2, 0)}` : notification.timestamp} onChange={(e) => handleNotification(e)} />
            <label style={LANGUAGES.font[language]}>Description [TH]: </label>
            <input type="text" name='notification_th' value={isEmptyObject(notification) ? "Empty" : notification.notification_th} onChange={(e) => handleNotification(e)} />
            <label style={LANGUAGES.font[language]}>Description [EN]: </label>
            <input type="text" name='notification_en' value={isEmptyObject(notification) ? "Empty" : notification.notification_en} onChange={(e) => handleNotification(e)} />
          </form>
        </div>
        <div className="full-notification" style={showNotificationFull}>
          <form>
            <div className="header-notification">
              <h3 style={LANGUAGES.font[language]}>Notification</h3>
              <div className="icon-2">
                <button type="submit">
                  <FontAwesomeIcon icon={isEmptyObject(styleNotification) ? faPlus : faTrashCan} className='icon' onClick={() => handleNewDelete(isEmptyObject(styleNotification))} />
                </button>
                <FontAwesomeIcon icon={faRightToBracket} className='icon' onClick={() => setShowNotificationFull({ display: "none" })} />
              </div>
            </div>
            <div className="line-date">
              <label style={LANGUAGES.font[language]}>End Date: </label>
              <input type="date" name='timestamp' value={isEmptyObject(notification) ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, 0)}-${String(currentDate.getDate()).padStart(2, 0)}` : notification.timestamp} onChange={(e) => handleNotification(e)} /> <br />
              <div className="all-text-label">
                <label style={LANGUAGES.font[language]}>Description [TH]: </label>
                <textarea type="text" name='notification_th' value={isEmptyObject(notification) ? "Empty" : notification.notification_th} onChange={(e) => handleNotification(e)} /> <br />
              </div>
              <div className="all-text-label">
                <label style={LANGUAGES.font[language]}>Description [EN]: </label>
                <textarea type="text" name='notification_en' value={isEmptyObject(notification) ? "Empty" : notification.notification_en} onChange={(e) => handleNotification(e)} />
              </div>
            </div>
          </form>
        </div>
        <div className="report" onClick={() => setShowReportFull({ display: "flex" })}>
          <h1 style={LANGUAGES.font[language]}>({report.length}) Report</h1>
        </div>
        <div className="full-report" style={showReportFull}>
          {/* <FontAwesomeIcon icon={faRightToBracket} className='icon' onClick={() => setShowNotificationFull({ display: "none" })} /> */}
          <table   style={LANGUAGES.font[language]}>
            <tr>
              <th>Count</th>
              <th>Title</th>
              <th>Issue Type</th>
              <th>Severity</th>
              <th>View</th>
              <th>Flag</th>
            </tr>
            {
              report.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx}</td>
                    <td>{item.title}</td>
                    <td>{item.issue_type}</td>
                    <td>{item.severity}</td>
                    <td><div className="view">Open</div></td>
                    <td><div className="flag">Flag</div></td>
                  </tr>
                )
              })
            }
          </table>
        </div>
        <div className="view-one-report" style={viewReport}>
          <h1>Hello</h1>
        </div>
        <div className="exit">
          <h1 style={LANGUAGES.font[language]}>Exit</h1>
        </div>
        <div className="token-calculator" style={LANGUAGES.font[language]}>
          <h1 style={LANGUAGES.font[language]}> {(((((parseInt(tokens.prompt_tokens) * 0.005) + (parseInt(tokens.completion_tokens) * 0.015)) / 1000) * 34) * 100).toFixed(2)} THB </h1>
          <p style={LANGUAGES.font[language]}>Prompt Tokens: {tokens.prompt_tokens} tokens</p>
          <p style={LANGUAGES.font[language]}>Completion Tokens: {tokens.completion_tokens} tokens</p>
          <h2 style={LANGUAGES.font[language]}>Total Tokens: {tokens.total_token} tokens</h2>
        </div>
      </div>
      <div className="admin-not-support">
        <FontAwesomeIcon style={{ position: "absolute", top: "1rem", right: "1rem" }} icon={faRightToBracket} onClick={() => { localStorage.removeItem("id"); localStorage.removeItem("section_id"); navigate("/pj-DPUCare") }} />
        <h1 style={LANGUAGES.font[language]}>Not Support</h1>
      </div>
      <Toast data={toast} />
    </div>
  )
}

export default Admin