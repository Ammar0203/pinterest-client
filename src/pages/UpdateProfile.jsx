import { useContext, useEffect, useRef, useState } from "react"
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import Header from '../components/Header'
import avatar from '../../public/avatar.png'
import API_URL from "../url"
import Error from "../components/Error"

function Form() {

  const { handleUpdateUser, user } = useContext(AuthContext);
  const navigate = useNavigate()
  
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [successful, setSuccessful] = useState(null)

  const fileUpload = useRef(null)
  
    useEffect(() => {
      setName(user?.name || '')
    }, [user])
  
  async function onImageChange(e) {
    if(!(e.target.files && e.target.files[0])) return
    setError(null) 
    setImage(e.target.files[0])
  }

  function handleInputChange(e, setState) {
    setError(null)
    setState(e.target.value)
  }

  async function onSubmit(e) {
    e.preventDefault()
    if(error) return
    setDisabled(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      if(image) formData.append('avatar', image)
      const response = await handleUpdateUser(formData)
      setSuccessful('Profile has updated successfully')
      setTimeout(() => {
        setSuccessful('')
      }, 5000)
    }
    catch (err) {
      console.log(err)
      setError(err.response.data.errors)
    }
    finally{
      setDisabled(false)
    }
  }

  return (
    <>
      <form className='form' onSubmit={onSubmit}>
        <div className='input-container'>
          <img onClick={e => fileUpload.current.click()} src={image ? URL.createObjectURL(image) : (user?.avatar ? `${API_URL}/avatars/${user?.avatar}` : avatar)} style={{borderRadius: "50%", width: 120, height: 120, objectFit: 'cover', alignSelf: 'center', cursor: 'pointer'}} />
          <input ref={fileUpload} type='file' onChange={onImageChange} style={{display: 'none'}} />
        </div>
        <div className='input-container'>
          <label htmlFor='name'>Name</label>
          <input value={name} onChange={(e) => handleInputChange(e, setName)} id="name" className='input' placeholder='Name' required autoComplete='false'/>
          <Error error={error} path='name' />
        </div>
        <div className='input-container' style={{opacity: 0.7}}>
          <label>Email</label>
          <input value={user?.email || ''} className='input' placeholder='Email' required autoComplete='false' disabled />
        </div>
        {successful && <div className='successful'>{successful}</div>}
        <button type="submit" disabled={disabled} className='red-button'>Update</button>
        <button className="grey-button" onClick={() => navigate(`/profile/${user?._id}`)}>Cancel</button>
      </form>
    </>
  )
}

export default function UpdateProfile() {

  return (
    <>
      <Header />
      <div className='container'>
        <div className='title'>Update Your Profile</div>
        <Form />
      </div>
    </>
  )
}