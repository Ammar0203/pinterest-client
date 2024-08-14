import { useContext, useState } from "react"
import {Link} from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import Header from '../components/Header'
import Error from "../components/Error"

function Form({handleLogin}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [disabled, setDisabled] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if(error) return
    setDisabled(true)
    const err = []

    const validateEmail = function(email) {
      var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return re.test(email)
    };

    try {
      if (password.length < 5) err.push({msg: "Password must be at least 5 characters.", path: 'password'})
      if (!email) err.push({msg: "Email can not be empty.", path: 'email'})
      if (!validateEmail(email)) err.push({msg: "Email is invalid.", path: 'email'})

      if(err.length) return setError(err)

      await handleLogin({email, password})
    }
    catch (err) {
      setError(err?.response?.data?.errors)
    }
    finally {
      setDisabled(false)
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
          <label htmlFor='email'>Email</label>
          <input value={email} onChange={(e) => handleInputChange(e, setEmail)} id="email" className='input' placeholder='Email' type='email' required autoComplete='false' />
          <Error error={error} path='email' />
        </div>
        <div className='input-container'>
          <label htmlFor='password'>Password</label>
          <input value={password} onChange={(e) => handleInputChange(e, setPassword)} id="password" className='input' placeholder='Password' type='password' required autoComplete='false'/>
          <Error error={error} path='password' />
        </div>
        <button type="submit" disabled={error || disabled} className='red-button'>log in</button>
      </form>
      <Link className='redirect' to='/signup' style={{marginBottom: 50}}>
        Not on Pinterest yet? Sign up
      </Link>
    </>
  )
}

export default function Login() {

  const { handleLogin } = useContext(AuthContext);
  
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