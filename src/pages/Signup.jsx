import { useContext, useState } from "react"
import {Link} from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import Header from '../components/Header'
import Error from "../components/Error"

function Form({handleSignUp}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
      if (!name) err.push({msg: 'Name can not be empty.', path: 'name'})
      if (password.length < 5) err.push({msg: "Password must be at least 5 characters.", path: 'password'})
      if (password !== confirmPassword) err.push({msg: "Passwords do not match.", path: 'confirmPassword'})
      if (!email) err.push({msg: "Email can not be empty.", path: 'email'})
      if (!validateEmail(email)) err.push({msg: "Email is invalid.", path: 'email'})

      if(err.length) return setError(err)

      await handleSignUp({name, email, password})
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
          <label htmlFor='name'>Name</label>
          <input value={name} onChange={(e) => handleInputChange(e, setName)} id="name" className='input' required placeholder='Name' autoComplete='false'/>
          <Error error={error} path='name' />
        </div>
        <div className='input-container'>
          <label htmlFor='email'>Email</label>
          <input value={email} onChange={(e) => handleInputChange(e, setEmail)} id="email" className='input' required placeholder='Email' type='email' autoComplete='false'/>
          <Error error={error} path='email' />
        </div>
        <div className='input-container'>
          <label htmlFor='password'>Password</label>
          <input value={password} onChange={(e) => handleInputChange(e, setPassword)} id="password" className='input' required placeholder='Password' type='password' autoComplete='false'/>
          <Error error={error} path='password' />
        </div>
        <div className='input-container'>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input value={confirmPassword} onChange={(e) => handleInputChange(e, setConfirmPassword)} id="confirmPassword" className='input' required placeholder='Confirm Password' type='password' autoComplete='false'/>
          <Error error={error} path='confirmPassword' />
        </div>
        <button type="submit" disabled={error || disabled} className='red-button'>Sign up</button>
      </form>
      <Link className='redirect' to='/login' style={{marginBottom: 50}}>
        Have an account? Log in
      </Link>
    </>
  )
}

export default function Signup() {

  const { handleSignUp } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className='container'>
        <img src='pinterest.png' className='logo' />
        <div className='title'>Welcome to Pinterest</div>
        <Form handleSignUp={handleSignUp} />
      </div>
    </>
  )
}