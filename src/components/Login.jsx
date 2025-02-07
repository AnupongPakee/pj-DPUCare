import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios"

import STYLE from "../style/Style"

function Login() {
  const URL = "http://127.0.0.1:8000"
  const [form, setForm] = useState({})
  const navigate = useNavigate()

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(URL + "/login", form)
      .then((res) => {
        console.log(res);
        localStorage.setItem("status", "sucess")
        localStorage.setItem("id", res.data.id)
        localStorage.setItem("theme", res.data.theme)
        navigate("/pj-DPUCare")
      })
      .catch((err) => console.log(err))
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
    </div>
  )
}

export default Login