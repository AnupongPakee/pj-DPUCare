import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRepeat, faFlag } from "@fortawesome/free-solid-svg-icons"
import { motion } from "framer-motion"

import STYLE from "../style/Style"
import THEMES from "../style/Themes"
import { handleToast } from "../utils"

function Toast(props) {
  const [progress, setProgress] = useState(0)
  
  const { show, status, text, icon, font, flag, report, duration, theme } = props.data

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

  const raw_style = {
    "show": { true: { display: "block" }, false: { display: "none" } },
    "status": {
      "success": { backgroundColor: "#24ff42" },
      "warn": { backgroundColor: "#ffda24" },
      "mistake": { backgroundColor: "#ff2424" }
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
      <div className="content" style={THEMES[theme].toast.color}>
        <div className="header" style={THEMES[theme].toast.header}>
          <div className="left">
            <div className="status" style={raw_style.status[status]}></div>
            <h1 style={STYLE.font_family.th}>แจ้งเตือน</h1>
          </div>
          <FontAwesomeIcon icon={flag ? faFlag : faRepeat} style={raw_style.icon[icon]} className='icon' onClick={() => handleToast(flag, report)} />
        </div>
        <div className="mean" style={THEMES[theme].toast.mean}>
          <p style={STYLE.font_family[font]}>{text}</p>
        </div>
        <motion.div className="loader" initial={{width: "0%"}} animate={{width: `${progress}%`}} transition={{duration: 0.5, ease: "easeOut"}} style={THEMES[theme].toast.loader}></motion.div>
      </div>
    </div>
  )
}

export default Toast