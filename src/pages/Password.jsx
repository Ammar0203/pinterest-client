import { useState } from "react"
import {useNavigate} from 'react-router-dom'
import Header from '../components/Header'
import api from "../api"
import Error from "../components/Error"

function Form() {

  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [successful, setSuccessful] = useState(null)

  function handleInputChange(e, setState) {
    setError(null)
    setState(e.target.value)
  }

  async function onSubmit(e) {
    e.preventDefault()
    if(error) return
    setDisabled(true)
    try {
      const response = await api.post('/api/user/password', {password, newPassword})
      setSuccessful(response.data)
      setTimeout(() => {
        setSuccessful(null)
      }, 5000)
    }
    catch (err) {
      console.log(err)
      setError(err.response.data.errors)
    }
    finally {
      setDisabled(false)
    }
  }

  return (
    <>
      <form className='form' onSubmit={onSubmit}>
        <div className='input-container'>
          <label htmlFor='newPassword'>New Password</label>
          <input value={newPassword} onChange={(e) => handleInputChange(e, setNewPassword)} minLength={5} id="newPassword" className='input' placeholder='New Password' type='password' required autoComplete='false'/>
          <Error error={error} path='newPassword' />
        </div>
        <div className='input-container'>
          <label htmlFor='password'>Password*</label>
          <input value={password} onChange={(e) => handleInputChange(e, setPassword)} minLength={5} id="password" className='input' placeholder='Password' type='password' required autoComplete='false'/>
          <Error error={error} path='password' />
        </div>
        {successful && <div className='successful'>{successful}</div>}
        <button type="submit" disabled={error || disabled} className='red-button'>Change password</button>
        <button className="grey-button" onClick={() => navigate(`/profile/${user?._id}`)}>Cancel</button>
      </form>
    </>
  )
}

export default function Password() {

  return (
    <>
      <Header />
      <div className='container'>
        <div className='title'>Change Your Password</div>
        <Form />
      </div>
    </>
  )
}