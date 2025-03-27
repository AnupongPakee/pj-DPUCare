import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"

import STYLE from "../style/Style"
import { login, test_connect } from "../API"
import Toast from './Toast'

function Login() {
  const [form, setForm] = useState({})
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
          "text": "ติดต่อกับฝั่งเซิฟร์เวอร์ไม่สำเร็จ"
        })
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
    login(form)
      .then((res) => {
        localStorage.setItem("status", "sucess")
        localStorage.setItem("id", res.data.id)
        localStorage.setItem("theme", res.data.theme)
        navigate("/pj-DPUCare")
      })
      .catch((err) => {
        if (err.response.data.detail == "user or email not found") {
          setToast({
            "show": "true",
            "status": "warn",
            "text": "บัญชีนี้ไม่มีอยู่ในระบบ กรุณาตรวจสอบหรือสมัครสมาชิกใหม่",
            "reload": "false"
          })
          setTimeout(() => {
            setToast({"show": "false"})
          }, 4500);
        }
        else if (err.response.data.detail == "password is incorrect") {
          setToast({
            "show": "true",
            "status": "warn",
            "text": "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
            "reload": "false"
          })
          setTimeout(() => {
            setToast({"show": "false"})
          }, 4500);
        }
      })
  }

  return (
    <div className='container login' style={STYLE.container}>
      <div className="content" id='content-lgn'>
        <div className="left"></div>
        <div className="right">
          <form onSubmit={handleSubmit} id='form'>
            <h1 style={STYLE.font_family.th}>เข้าสู่ระบบ</h1>
            <input type="text" name='username' style={STYLE.font_family.th} placeholder='ชื่อผู้ใช้ / อีเมล์' onChange={(e) => handleChange(e)} />
            <input type="password" name='password' id='password' style={STYLE.font_family.th} placeholder='รหัสผ่าน' onChange={(e) => handleChange(e)} /> <br />
            <button type="submit">ลงชื่อเข้าใช้</button>
          </form>
        </div>
      </div>
      <div className="not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
      <Toast data={toast} />
    </div>
  )
}

export default Login