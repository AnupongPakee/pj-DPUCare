import React, { useState } from 'react'

import STYLE from "../style/Style"

function Login() {
  const [form, setForm] = useState({})

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const showPass = () => {
    let checkbox = document.getElementById("check_password")
    const password = document.getElementById("password")
    if (checkbox.checked == true) {
      password.setAttribute("type", "text");
    } else {
      password.setAttribute("type", "password");
    }
  }
  return (
    <div className='container login' style={STYLE.container}>
      <div className="content" id='content-lgn'>
        <div className="left"></div>
        <div className="right">
          <form action="" id='form'>
            <h1 style={STYLE.font_family.th}>เข้าสู่ระบบ</h1>
            <input type="text" name='username' style={STYLE.font_family.th} placeholder='ชื่อผู้ใช้ / อีเมล์' onChange={(e) => handleChange(e)} />
            <input type="password" name='password' id='password' style={STYLE.font_family.th} placeholder='รหัสผ่าน' />
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