import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import api from "../api";
import avatar from "../../public/avatar.png";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import API_URL from "../url";

export default function Profile() {
  const { _id } = useParams();
  const { user, handleUpdateUser, handleChangePassword } = useContext(AuthContext);
  
  const [profile, setProfile] = useState();
  const [edit, setEdit] = useState(false)
  const [image, setImage] = useState(null)
  const [name, setName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [successful, setSuccessful] = useState(null)
  
  const fileUpload = useRef(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get(`/api/user/${_id}`);
        const profile = response.data.user
        setProfile(profile);
        setName(profile.name)
      } catch (err) {
        console.log(err);
      }
    }

    fetchProfile();
  }, [_id, user]);

  async function onImageChange(e) {
    if(!(e.target.files && e.target.files[0])) return 
    setImage(e.target.files[0])
  }
  function handleInputChange(e, setState) {
    setError(null)
    setState(e.target.value)
  }
  function handleCancel(e) {
    setImage(null)
    setName(profile.name)
    setPassword('')
    setNewPassword('')
    setError(null)
    setEdit(false)
  }

  async function onSubmit(e) {
    e.preventDefault()
    if(error) return
    try {
      const formData = new FormData()
      formData.append('name', name)
      if(image) formData.append('avatar', image)
      const response = await handleUpdateUser(formData)
      setEdit(false)
    }
    catch (err) {
      console.log(err)
      setError(err.response.data)
    }
  }
  
  async function onSubmitPassword(e) {
    e.preventDefault()
    if(error) return
    try {
      const response = await api.post('/api/user/password', {password, newPassword})
      setSuccessful(response.data)
      setTimeout(() => {
        setSuccessful(null)
      }, 5000)
    }
    catch (err) {
      setError(err.response.data)
    }
  }

  return (
    <>
      <Header />
      <div>
        {edit ? 
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "0 1rem",
                gap: "1rem",
                width: "fit-content",
                // position: "fixed",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: 'pointer'
                }}
                onClick={handleCancel}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black",
                    borderRadius: 360,
                    width: "1.8rem",
                    height: "1.8rem",
                    opacity: 0,
                    position: "absolute",
                    zIndex: 1,
                    transition: "all 150ms",
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = 0;
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = 0.1;
                  }}
                />
                <IonIcon icon={arrowBackOutline} />
              </div>
              <h3 style={{ fontWeight: 600 }}>Back</h3>
            </div>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center', gap: 48}}>
              <form className='form' onSubmit={onSubmit}>
                <div className='input-container'>
                  <img onClick={e => fileUpload.current.click()} src={image ? URL.createObjectURL(image) : (profile?.avatar ? `${API_URL}/avatars/${profile?.avatar}` : avatar)} style={{borderRadius: "50%", width: 120, height: 120, objectFit: 'cover', alignSelf: 'center', cursor: 'pointer'}} />
                  <input ref={fileUpload} type='file' onChange={onImageChange} style={{display: 'none'}} />
                </div>
                <div className='input-container'>
                  <label htmlFor='name'>Name</label>
                  <input value={name} onChange={(e) => handleInputChange(e, setName)} id="name" className='input' placeholder='Name' required autoComplete='false'/>
                </div>
                <div className='input-container' style={{opacity: 0.7}}>
                  <label>Email</label>
                  <input value={profile?.email} className='input' placeholder='Email' required autoComplete='false' disabled />
                </div>
                <button type="submit" className='red-button'>Update</button>
                <button className="grey-button" onClick={handleCancel}>Cancel</button>
              </form>
              <div style={{width: 1, backgroundColor: '#e9e9e9'}} />
              <form className='form' onSubmit={onSubmitPassword}>
                <div className='input-container'>
                  <label htmlFor='newPassword'>New Password</label>
                  <input value={newPassword} onChange={(e) => handleInputChange(e, setNewPassword)} id="newPassword" className='input' placeholder='New Password' type='password' required autoComplete='false'/>
                </div>
                <div className='input-container'>
                  <label htmlFor='password'>Password*</label>
                  <input value={password} onChange={(e) => handleInputChange(e, setPassword)} id="password" className='input' placeholder='Password' type='password' required autoComplete='false'/>
                  {error && <div className='error'>{error}</div>}
                  {successful && <div className='successful'>{successful}</div>}
                </div>
                <button type="submit" disabled={error} className='red-button'>Change password</button>
                <button className="grey-button" style={{visibility: 'hidden'}}>Cancel</button>
              </form>
            </div>
          </>
          :
          <>
            {profile?._id === user?._id && 
              <div onClick={e => setEdit(true)} className="button grey" style={{width: 'fit-content', margin: '0 16px', cursor: 'pointer'}}>Edit Profile</div>
            } 
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16, margin: '20px'}}>
              <img src={profile?.avatar ? `${API_URL}/avatars/${profile?.avatar}` : avatar} style={{borderRadius: "50%", width: 120, height: 120, objectFit: 'cover'}} />
              <div style={{ fontSize: "36px" }}>{profile?.name}</div>
              <div style={{width: '100%', height: 1, backgroundColor: '#e9e9e9'}} />
            </div>
            <Cards query={_id}/>
          </>
          }

      </div>
    </>
  );
}
