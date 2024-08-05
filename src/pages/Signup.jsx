import './styles/Auth.css'
import { useContext, useState } from "react"
import api from "../api"
import {Link} from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import Header from '../components/Header'

function Form({handleLogin}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)

  async function onSubmit(e) {

    var validateEmail = function(email) {
      var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return re.test(email)
    };
    
    e.preventDefault()
    if(error) return
    try {
      if (password !== confirmPassword) {
        return setError({ passwords: {message: `Passwords do not match.`}})
      }
      if (!validateEmail(email)) {
        return setError({ email: {message: 'Invalid email'}})
      }
      await api.post('/api/auth/signup', {name, email, password})
      await handleLogin(email, password)
    }
    catch (err) {
      console.log(err)
      setError(err.response.data)
    }
  }

  function handleInputChange(e, setState) {
    setError(null)
    setState(e.target.value)
  }
  return (
    <>
      <form onSubmit={onSubmit} className='form'>
        <div className='input-container'>
          <label htmlFor='name'>Name</label>
          <input value={name} onChange={(e) => handleInputChange(e, setName)} id="name" className='input' placeholder='Name' required autoComplete='false'/>
        </div>
        <div className='input-container'>
          <label htmlFor='email'>Email</label>
          <input value={email} onChange={(e) => handleInputChange(e, setEmail)} id="email" className='input' placeholder='Email' type='email' required autoComplete='false'/>
          {error?.email?.message && <div className='error'>{error.email.message}</div>}
        </div>
        <div className='input-container'>
          <label htmlFor='password'>Password</label>
          <input value={password} onChange={(e) => handleInputChange(e, setPassword)} id="password" className='input' placeholder='Password' type='password' required autoComplete='false'/>
        </div>
        <div className='input-container'>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input value={confirmPassword} onChange={(e) => handleInputChange(e, setConfirmPassword)} id="confirmPassword" className='input' placeholder='Confirm Password' type='password' required autoComplete='false'/>
          {error?.passwords?.message && <div className='error'>{error.passwords.message}</div>}
        </div>
        <button type="submit" disabled={error} className='red-button'>Sign up</button>
      </form>
      <Link className='redirect' to='/login' style={{marginBottom: 50}}>
        Have an account? Log in
      </Link>
    </>
  )
}

export default function Signup() {

  const { isAuthenticated, user, handleLogin, handleLogout } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className='container'>
        <img src='pinterest.png' className='logo' />
        <div className='title'>Welcome to Pinterest</div>
        <Form handleLogin={handleLogin} />
      </div>
    </>
  )
}