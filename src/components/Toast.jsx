import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRepeat, faFlag } from "@fortawesome/free-solid-svg-icons"
import { motion } from "framer-motion"

import THEMES from "../style/Themes"
import LANGUAGES from "../style/Language"
import { create_report } from "../API"

function Toast(props) {
  const [progress, setProgress] = useState(0)
  const [checkReport, setCheckReport] = useState(false)

  const { show, status, text, icon, font, flag, report, duration, drive, theme } = props.data

  useEffect(() => {
    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [duration]);

  const handleReport = async () => {
    if (flag) {
      create_report(report)
        .then((_) => {
          setCheckReport(true)
        }).catch((err) => {
          console.log(err);
        })
    } else {
      window.location.reload()
    }
  }

  const raw_style = {
    "show": { true: { display: "block" }, false: { display: "none" } },
    "status": {
      "success": { backgroundColor: "#24ff42" },
      "warn": { backgroundColor: "#ffda24" },
      "mistake": { backgroundColor: "#ff2424" },
      "admin": { backgroundColor: "rgb(210, 189, 0)" }
    },
    "icon": { true: { display: "block" }, false: { display: "none" } },
    "en": {
      fontFamily: "Roboto, sans-serif",
      letterSpacing: "1px"
    },
    "th": {
      fontFamily: "IBM Plex Sans Thai, sans-serif",
      letterSpacing: "1px"
    }
  }

  return (
    <div className='container toast' style={raw_style.show[show ? show : false]}>
      <div className="content" style={THEMES[drive][theme].fontcolor}>
        <div className="header" style={THEMES[drive][theme].toast.header}>
          <div className="left">
            <div className="status" style={checkReport ? raw_style.status["success"] : raw_style.status[status]}></div>
            <h1 style={LANGUAGES.font[font]}>{LANGUAGES.language[font ? font : "en"].warn.notifications}</h1>
          </div>
          <FontAwesomeIcon icon={flag ? faFlag : faRepeat} style={checkReport ? raw_style.icon[false] : raw_style.icon[icon]} className='icon' onClick={() => handleReport()} />
        </div>
        <div className="mean" style={THEMES[drive][theme].toast.mean}>
          <p style={LANGUAGES.font[font]}>{checkReport ? LANGUAGES.language[font ? font : "en"].warn.report_text : text}</p>
        </div>
        <motion.div className="loader" initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} style={THEMES[drive][theme].toast.loader}></motion.div>
      </div>
    </div>
  )
}

export default Toast