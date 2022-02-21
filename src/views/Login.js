import React, { useContext, useState } from 'react'
import MyContext from '../state/MyContext'
import { useHistory } from 'react-router'
import TextField from '@material-ui/core/TextField'
import logo_img from '../assets/test_image.png'

export default function Login() {
  const context = useContext(MyContext)
  const history = useHistory()
  const [code, setCode] = useState('')
  const [errorCode, setErrorCode] = useState('')

  let checkCode = async (e) => {
    e.preventDefault()
    setErrorCode('')
    if (code === context.access_code) {
      context.setAuthorized(true)
      history.push('/')
    } else {
      setCode('')
      setErrorCode('Incorrect Code')
      setTimeout(() => setErrorCode(''), 3000)
    }
  }

  return (
    <div className="login_container">
      <div className="form_container">
        <img alt={'SASW'} className="login_logo" src={logo_img} />
        <p className="login_title">Access Code</p>
        <form onSubmit={(e) => checkCode(e)}>
          <TextField
            id="outlined-password-input"
            label="Code"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            value={code}
            onChange={(v) => setCode(v.target.value)}
          />
          <p className="login_error_message">{errorCode}</p>
        </form>
      </div>
    </div>
  )
}
