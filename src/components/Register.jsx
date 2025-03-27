import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"

import STYLE from "../style/Style"
import { register, new_profile, new_section, new_message, test_connect } from "../api"
import Toast from './Toast'

function Register() {
  const [user, setUser] = useState({})
  const [profile, setProfile] = useState({})
  const [style, setStyle] = useState({ display: "none" })
  const [toast, setToast] = useState({ "show": "false" })
  const navigate = useNavigate()

  useEffect(() => {
    test_connect()
      .then((_) => {
        console.log("connect: success");
      }).catch((err) => {
        console.log(err);
        setToast({
          "show": "true",
          "status": "mistake",
          "text": "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองอีกครั้งในภายหลัง"
        })
      })
  }, [])

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleChange2 = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  const handleTime = (second) => {
    setTimeout(() => {
      setToast({ "show": "false" })
    }, second);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    register(user)
      .then(async (res) => {
        localStorage.setItem("theme", res.data.theme)
        localStorage.setItem("id", res.data.id)
        localStorage.setItem("status", "sucess")
        new_section(res.data.id)
          .then(async (res) => {
            localStorage.setItem("section", res.data.section_id)
            new_message(res.data.section_id, { "question": "สวัสดี" })
              .then((_) => {
                setStyle({ display: "flex" })
              }).catch((err) => console.log(err))
          }).catch((err) => console.log(err))
      })
      .catch((err) => {
        if (err.response.data.detail == "user already exists") {
          setToast({
            "show": "true",
            "status": "warn",
            "text": "ชื่อผู้ใช้ซ้ำกับบัญชีที่มีอยู่ กรุณาลองเพิ่มตัวเลขหรืออักขระพิเศษ",
            "icon": "false"
          })
          setTimeout(() => {
            setToast({ "show": "false" })
          }, 4500);
        }
        else if (err.response.data.detail == "email already exists") {
          setToast({
            "show": "true",
            "status": "warn",
            "text": "มีบัญชีที่ลงทะเบียนด้วยอีเมลนี้แล้ว กรุณาเข้าสู่ระบบ",
            "icon": "false"
          })
          setTimeout(() => {
            setToast({ "show": "false" })
          }, 4500);
        } else {
          setToast({
            "show": true,
            "status": "mistake",
            "text": "error",
            "icon": true,
            "flag": true,
            "report": {
              report_id: "123",
              timestamp: "12-1-24",
              issue_type: "function",
              user_id: "123455",
              role: "user",
              title: "error",
              description: "error",
              severity: "hight",
              status: "wait",
              assigned_to: "admin"
            }
          })
          handleTime(10000)
        }
      })
  }

  const handleSubmitProfile = async e => {
    e.preventDefault();
    new_profile(localStorage.getItem("id"), profile)
      .then((_) => {
        navigate("/pj-DPUCare")
      }).catch((err) => {
        setToast({
          "show": "true",
          "status": "mistake",
          "text": "สร้างโปรไฟล์ไม่สำเร็จ กรุณาลองอีกครั้งในภายหลัง",
          "icon": "false"
        })
        setTimeout(() => {
          setToast({ "show": "false" })
        }, 4500);
      })
  }

  const showBorderStyle = (check) => {
    const man = document.getElementById("manLabel")
    const women = document.getElementById("womenLabel")
    console.log(check);

    if (check == "man") {
      man.style.border = "2px solid #E0EAFC"
      women.style.border = "none"
    } else if (check == "women") {
      women.style.border = "2px solid #E0EAFC"
      man.style.border = "none"
    }
  }

  return (
    <div className='container register' style={STYLE.container}>
      <div className="content" id='content-rgs'>
        <div className="left">
          <form onSubmit={handleSubmit} id='form'>
            <h1 style={STYLE.font_family.th}>สมัครสมาชิก</h1>
            <input type="text" name='name' style={STYLE.font_family.th} placeholder='ชื่อผู้ใช้' onChange={(e) => handleChange(e)} />
            <input type="email" name='email' style={STYLE.font_family.th} placeholder='อีเมล์' onChange={(e) => handleChange(e)} /> <br />
            <input type="password" name='password' id='password' style={STYLE.font_family.th} placeholder='รหัสผ่าน' onChange={(e) => handleChange(e)} />
            <input type="password" id='confirm' style={STYLE.font_family.th} placeholder='ยืนยันรหัสอีกครั้ง' /> <br />
            <button type="submit">สร้างบัญชี</button>
          </form>
        </div>
        <div className="right">
        </div>
      </div>
      <div className="new-profile" style={style}>
        <form onSubmit={handleSubmitProfile}>
          <h1 style={STYLE.font_family.th} className='header-profile'>โปรไฟล์</h1>
          <div className="label-sex">
            <h1 style={STYLE.font_family.th}>เพศ</h1>
            <div className="sex">
              <label htmlFor="manId" id='manLabel' style={STYLE.font_family.th} onClick={() => showBorderStyle("man")}>ชาย</label>
              <input type="radio" id="manId" name="sex" value={"man"} onChange={(e) => handleChange2(e)} />
              <label htmlFor="womenId" id='womenLabel' style={STYLE.font_family.th} onClick={() => showBorderStyle("women")}>หญิง</label>
              <input type="radio" id='womenId' name="sex" value={"women"} onChange={(e) => handleChange2(e)} />
            </div>
          </div>
          <div className="label-age">
            <h1 style={STYLE.font_family.th}>อายุ</h1>
            <input type="number" min={1} name="age" style={STYLE.font_family.th} placeholder="เพิ่มเติม" onChange={(e) => handleChange2(e)} />
          </div>
          <div className="label-job">
            <h1 style={STYLE.font_family.th}>อาชีพ</h1>
            <select name="job" className='job' defaultValue={"non"} onChange={(e) => handleChange2(e)}>
              <option value="non">เลือกอาชีพ</option>
              <option value="student">นักศึกษา</option>
              <option value="teacher">อาจารย์</option>
            </select>
          </div>
          <div className="btn-2">
            <button onClick={() => navigate("/pj-DPUCare")}>ข้ามไปก่อน</button>
            <button type='submit'>บันทึก</button>
          </div>
        </form>
      </div>
      <div className="not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
      <Toast data={toast} />
    </div>
  )
}

export default Register