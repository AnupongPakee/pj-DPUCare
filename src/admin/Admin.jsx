import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFloppyDisk, faRightToBracket, faExpand, faPlus, faTrashCan, faBug, faRotateRight, faThermometer, faPaperPlane } from "@fortawesome/free-solid-svg-icons"

import { get_information, get_notification, get_report, get_one_report, get_section, get_history, new_information, new_section, new_message, create_notification, del_notification, del_section, del_report, test_connect } from "../API"
import THEMES from "../style/Themes"
import LANGUAGES from "../style/Language"
import Toast from '../components/Toast'

function Admin() {
  const [time, setTime] = useState(new Date());
  const [timestamp, setTimeStamp] = useState(new Date());
  const [form, setForm] = useState({})
  const [message, setMessage] = useState([])
  const [firstMessage, setFirstMessage] = useState({})
  const [platform, setPlatform] = useState(localStorage.getItem("platform") ? localStorage.getItem("platform") : "window")
  const [language, setLanguage] = useState(localStorage.getItem("language") ? localStorage.getItem("language") : "en")
  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "default")
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
  const [oneReport, setOneReport] = useState({})
  const [styleNotification, setStyleNotification] = useState({})
  const [showPromptFull, setShowPromptFull] = useState({ display: "none" })
  const [showNotificationFull, setShowNotificationFull] = useState({ display: "none" })
  const [showReportFull, setShowReportFull] = useState({ display: "none" })
  const [showReload, setShowReload] = useState({ display: "none" })
  const [viewReport, setViewReport] = useState({ display: "none" })

  const navigate = useNavigate()
  const messageEndRef = useRef(null);
  const currentDate = new Date()

  const user_id = localStorage.getItem("id")
  const section_id = localStorage.getItem("section_id")
  const report_id = localStorage.getItem("report_id")
  const status = localStorage.getItem("status")

  const scrollToBottom = () => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  const handleTime = (second) => {
    setTimeout(() => {
      setToast({ "show": false, "drive": platform, "theme": theme })
    }, second);
  }

  useEffect(() => {
    test_connect()
      .then((_) => {
        console.log("connect: success");
        getSection()
        getInformation()
        getNotification()
        getReport()
        getHistory()
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

  useEffect(() => {
    scrollToBottom()
  }, [message])

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

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
  
  const getSection = async () => {
    get_section(user_id)
      .then((res) => {
        if (res.data.length <= 0) {
          const first_ai = document.getElementById("first-ai")
          first_ai.innerHTML = LANGUAGES.language[language].no_chat
          return;
        }
        if (localStorage.getItem("section_id") == null) {
          localStorage.setItem("section_id", res.data[0].section_id)
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
            issue_type: err.code,
            user_id: `${user_id}`,
            title: "get_section [GET][Admin]",
            description: err.message,
            severity: "medium" 
          }
        })
        handleTime(10500)
        return;
      })
    }

    const getHistory = async () => {
      get_history(section_id)
        .then((res) => {          
          setFirstMessage(res.data.firstChat)
          setMessage(res.data.secondChatAll)
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
              timestamp: `[${timestamp.toLocaleDateString()}]:[${timestamp.toLocaleTimeString()}]`,
              issue_type: err.code,
              user_id: `${user_id}`,
              title: "get_history [GET][Admin]",
              description: err.message,
              severity: "medium"
            }
          })
          handleTime(10500)
          return;
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
            severity: "medium"
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
            severity: "medium"
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
            severity: "medium",          }
        })
        handleTime(10500)
        return;
      })
  }

  const getOneReport = () => {
    get_one_report(report_id)
      .then((res) => {
        setOneReport(res.data[0])
        return;
      })
      .catch((err) => {
        console.log(err);
        setShowReload({ display: "flex" })
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
      setMessage([...message, rawMessage])
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
                    issue_type: err.code,
                    user_id: `${user_id}`,
                    title: "new_message [POST][Admin]",
                    description: err.message,
                    severity: "higth"
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
                issue_type: err.code,
                user_id: `${user_id}`,
                title: "new_section [POST][Admin]",
                description: err.message,
                severity: "higth"
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
              timestamp: `[${timestamp.toLocaleDateString()}]:[${timestamp.toLocaleTimeString()}]`,
              issue_type: err.code,
              user_id: `${user_id}`,
              title: "new_message [POST][Admin]",
              description: err.message,
              severity: "hight"
            }
          })
          handleTime(10500)
          return;
        })
    }
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
            severity: "medium"
          }
        })
        handleTime(10500)
        return;
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
            }
          })
          handleTime(10500)
          return;
        })
    }
  }

  const handleDeleteReport = () => {
    del_report(report_id)
      .then((_) => {
        localStorage.removeItem("report_id")
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
            title: "del_report [DELETE][Admin]",
            description: err.message,
            severity: "medium",
          }
        })
        handleTime(10500)
        return;
      })
  }

  const deleteSection = () => {
    del_section(section_id)
      .then((_) => {
        window.location.reload();
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
            title: "del_section [DELETE][Admin]",
            description: err.message,
            severity: "medium",
          }
        })
        handleTime(10500)
        return;
      })
  }

  const setReportId = (id) => {
    setViewReport({ display: "flex" })
    localStorage.setItem("report_id", id)
    getOneReport()
  }

  const exit = () => {
    localStorage.removeItem("id")
    localStorage.removeItem("section_id")
    localStorage.removeItem("report_id")
    localStorage.removeItem("status")
    navigate("/pj-DPUCare")
  }

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
          <div className="mini-icon">
            <FontAwesomeIcon icon={faTrashCan} className='icon-del-chat' onClick={() => deleteSection()}/>
            <FontAwesomeIcon icon={faThermometer} className='icon-theme' onClick={() => changeTheme(true)} />
          </div>
          <div className="show-message">
            <div className='ai'>
              <p className='ai-message' id='first-ai' style={LANGUAGES.font[language]}>{(status == "sucess" && user_id != null) ? firstMessage.answer : LANGUAGES.language[language].first_message}</p>
            </div>
            {message.map((item, idx) => {
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
          {
            isEmptyObject(report) ? (<h1 className='no-report' style={LANGUAGES.font[language]} onClick={() => window.location.reload()}>No Report</h1>) : (
              <div className="block-group" style={LANGUAGES.font[language]}>
                <FontAwesomeIcon icon={faRightToBracket} className='icon' onClick={() => setShowReportFull({ display: "none" })} />
                <div className="header-block">
                  <h1 style={{ width: "10%" }}>Count</h1>
                  <h1 style={{ width: "30%" }}>Title</h1>
                  <h1 style={{ width: "10%" }}>Severity</h1>
                  <h1 style={{ width: "20%" }}>Issue Type</h1>
                  <h1 style={{ width: "10%" }}>View</h1>
                </div>
                <div className="list-block">
                  {
                    report.map((item, key) => {
                      return (
                        <div className="report-detail" key={key}>
                          <h3 style={{ width: "10%" }}>{key}</h3>
                          <h3 style={{ width: "30%" }}>{item.title}</h3>
                          <h3 style={{ width: "10%" }}>{item.severity}</h3>
                          <h3 style={{ width: "20%" }}>{item.issue_type}</h3>
                          <div className="view" style={{ width: "10%" }} onClick={() => setReportId(item.id)}>Open</div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          }
        </div>
        <div className="view-one-report" style={viewReport}>
          <div className="detail" style={LANGUAGES.font[language]}>
            <FontAwesomeIcon icon={faBug} className='icon' onClick={(e) => handleDeleteReport(e)} />
            <FontAwesomeIcon icon={faRightToBracket} className='icon' onClick={() => setViewReport({ display: "none" })} />
            <h1>ID: {oneReport.id}</h1>
            <h1>User ID: {oneReport.user_id}</h1>
            <h1>Title: {oneReport.title}</h1>
            <h1>Issue Type: {oneReport.issue_type}</h1>
            <h1>Severity: {oneReport.severity}</h1>
            <h1>Description: {oneReport.description}</h1>
          </div>
        </div>
        <div className="reload-list-report" style={showReload}>
          <FontAwesomeIcon icon={faRotateRight} onClick={() => window.location.reload()} />
        </div>
        <div className="exit" onClick={() => exit()}>
          <h1 style={LANGUAGES.font[language]}>Exit</h1>
        </div>
        <div className="token-calculator" style={LANGUAGES.font[language]}>
          <h1 style={LANGUAGES.font[language]}> {isEmptyObject(tokens) ? 0 : (((((parseInt(tokens.prompt_tokens) * 0.005) + (parseInt(tokens.completion_tokens) * 0.015)) / 1000) * 34) * 100).toFixed(2)} THB </h1> <br />
          <p style={LANGUAGES.font[language]}>Prompt Tokens: {isEmptyObject(tokens) ? 0 : tokens.prompt_tokens} tokens</p>
          <p style={LANGUAGES.font[language]}>Completion Tokens: {isEmptyObject(tokens) ? 0 : tokens.completion_tokens} tokens</p> <br />
          <h2 style={LANGUAGES.font[language]}>Total Tokens: {isEmptyObject(tokens) ? 0 : tokens.total_token} tokens</h2>
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