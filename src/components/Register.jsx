import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"

import STYLE from "../style/Style"

function Register() {
  const URL = "http://127.0.0.1:8000"
  const [form, setForm] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(URL + "/register", form)
      .then(async (res) => {
        console.log(res);
        localStorage.setItem("theme", res.data.theme)
        localStorage.setItem("id", res.data.id)
        localStorage.setItem("status", "sucess")
        await axios.post(URL + "/section/" + res.data.id)
          .then(async (res) => {
            localStorage.setItem("section", res.data.id)
            await axios.post(URL + "/history/" + res.data.id, {"question": "สวัสดี"})
              .then((res) => {
                console.log(res);
                navigate("/pj-DPUCare")
              }).catch((err) => console.log(err))
          }).catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className='container register' style={STYLE.container}>
      <div className="content" id='content-rgs'>
        <div className="left">
          <form onSubmit={handleSubmit} id='form'>
            <h1 style={STYLE.font_family.th}>สมัครสมาชิก</h1>
            <input type="text" name='username' style={STYLE.font_family.th} placeholder='ชื่อผู้ใช้' onChange={(e) => handleChange(e)} />
            <input type="email" name='email' style={STYLE.font_family.th} placeholder='อีเมล์' onChange={(e) => handleChange(e)} /> <br />
            <input type="password" name='password' id='password' style={STYLE.font_family.th} placeholder='รหัสผ่าน' onChange={(e) => handleChange(e)} />
            <input type="password" id='confirm' style={STYLE.font_family.th} placeholder='ยืนยันรหัสอีกครั้ง' /> <br />
            <button type="submit">สร้างบัญชี</button>
          </form>
        </div>
        <div className="right">
        </div>
      </div>
      <div className="not-support">
        <h1 style={STYLE.font_family.en}>Not Support</h1>
      </div>
    </div>
  )
}

export default Register