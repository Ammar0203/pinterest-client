import { useState } from "react"
import api from "../api"
import Error from "./Error"

export default function EditPin({setEdit, setPin, pin}) {

  const [title, setTitle] = useState(pin?.title)
  const [description, setDescription] = useState(pin?.description)
  const [error, setError] = useState(null)
  const [disabled, setDisabled] = useState(false)

  async function handleUpdatePin(e) {
    try {
      e.preventDefault()
      setDisabled(true)
      const response = await api.post('/api/pin/update', {title, description, pin_id: pin?._id})
      setPin(response.data.pin)
      setEdit(false)
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
    <form onSubmit={(e) => handleUpdatePin(e)} style={{width: 508, display: "flex", flexDirection: "column", justifyContent: "flex-start", position: "relative", padding: 32, gap: 8}}>
      <div className='input-container'>
        <label htmlFor='title'>Title</label>
        <input id="title" maxLength={64} className='input' placeholder='Title' required autoComplete='false' value={title} onChange={(e) => {setError(null);setTitle(e.target.value)}} />
        <Error error={error} path='title' />
      </div>
      <div className='input-container'>
        <label htmlFor='description'>Description</label>
        <textarea className="textarea" id="description" maxLength={1000} style={{height: 500}} placeholder='Description' required autoComplete='false' value={description} onChange={(e) => {setError(null);setDescription(e.target.value)}} />
        <Error error={error} path='description' />
      </div>
      <button className="red-button" disabled={disabled || error} style={{width: '50%', alignSelf: 'center', cursor: 'pointer'}}>Update</button>
      <button className="grey-button" style={{width: '50%', alignSelf: 'center', cursor: 'pointer'}} onClick={(e) => {setTitle(pin?.title); setDescription(pin?.description); setEdit(false);}}>Cancel</button>
    </form>
  )
}