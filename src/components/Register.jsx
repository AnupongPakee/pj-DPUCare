import React, { useState } from 'react'

import STYLE from "../style/Style"

function Register() {
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
    const confirm = document.getElementById("confirm")
    if (checkbox.checked == true) {
      password.setAttribute("type", "text");
      confirm.setAttribute("type", "text");
    } else {
      password.setAttribute("type", "password");
      confirm.setAttribute("type", "password");
    }
  }

  return (
    <div className='container register' style={STYLE.container}>
      <div className="content" id='content-rgs'>
        <div className="left">
          <form action="" id='form'>
            <h1 style={STYLE.font_family.th}>สมัครสมาชิก</h1>
            <input type="text" name='username' style={STYLE.font_family.th} placeholder='ชื่อผู้ใช้' onChange={(e) => handleChange(e)} />
            <input type="email" name='email' style={STYLE.font_family.th} placeholder='อีเมล์' /> <br />
            <input type="password" name='password' id='password' style={STYLE.font_family.th} placeholder='รหัสผ่าน' />
            <input type="password" name='confirm' id='confirm' style={STYLE.font_family.th} placeholder='ยืนยันรหัสอีกครั้ง' /> <br />
            <div className="box-check">
              <input type="checkbox" name="check_password" id="check_password" onClick={showPass} />
            </div>
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