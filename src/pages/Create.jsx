import { IonIcon } from "@ionic/react";
import Header from "../components/Header";
import {
  arrowBackOutline,
  imageOutline,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import api from "../api";
import Error from "../components/Error";

export default function Create() {
  const navigate = useNavigate();

  const [pin, setPin] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false)

  const fileUpload = useRef();

  async function onImageChange(e) {
    setError(null);
    if (!(e.target.files && e.target.files[0])) return;
    setPin(e.target.files[0]);
  }

  async function handleCreatePin(e) {
    try {
      e.preventDefault();
      setDisabled(true)
      const err = []
      if (!pin) err.push({msg: "Please add a pin.", path: 'pin'});
      if (!title) err.push({msg: "Title can not be empty.", path: 'title'});
      if (!description) err.push({msg: "Description can not be empty.", path: 'description'});
      if(err.length) return setError(err)

      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('pin', pin)
      const response = await api.post("/api/pin/create", formData);
      navigate('/')
    } catch (err) {
      console.log(err);
      setError(err.response.data.errors)
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
      <Header />
      <div style={{display: "flex", alignItems: "center", margin: "0 1rem", gap: "1rem", width: "fit-content"}}>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer"}} onClick={(e) => navigate('/')}>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", borderRadius: 32, width: "1.8rem", height: "1.8rem", opacity: 0, position: "absolute", zIndex: 1, transition: "all 150ms"}} onMouseLeave={(e) => {e.target.style.opacity = 0;}} onMouseEnter={(e) => {e.target.style.opacity = 0.1;}}/>
          <IonIcon icon={arrowBackOutline} />
        </div>
        <h3 style={{ fontWeight: 600 }}>Back</h3>
      </div>

      {/* <form style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 100}} onSubmit={async (e) => handleCreatePin(e)}>
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", width: "fit-content", borderRadius: 32, boxShadow: "rgb(211 211 211) 0px 0px 20px 0px"}}>
          <div style={{position: "relative", width: 508, borderRadius: 32, padding: 20, display: "flex", flexDirection: 'column', alignItems: "center"}} >
            {pin ? (
              <img src={pin ? URL.createObjectURL(pin) : ""} style={{width: "100%", height: "min-content", objectFit: "contain", display: "flex", borderRadius: 16, objectPosition: "top", cursor: "pointer"}} onClick={(e) => fileUpload.current.click()} />
            ) : (
              <>
                <div className="input" style={{width: 468, height: 512, backgroundColor: "rgb(251 251 251)", borderWidth: 3, borderColor: "#e9e9e9", borderRadius: 32, borderStyle: "dashed", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", cursor: "pointer"}} onClick={(e) => fileUpload.current.click()}>
                  <IonIcon icon={imageOutline} style={{ fontSize: 32, opacity: 0.5 }}/>
                  <div style={{ opacity: 0.9 }}>Click to add a pin</div>
                </div>
                <Error error={error} path='pin' />
              </>
            )}
          </div>
          <div style={{width: 508, display: "flex", flexDirection: "column", justifyContent: "flex-start", position: "relative", padding: 32, gap: 8}} >
            <input name="pin" ref={fileUpload} type="file" onChange={e => onImageChange(e)} style={{ display: "none" }} />
            <div className="input-container">
              <label htmlFor="title">Title</label>
              <input name="title" id="title" maxLength={64} minLength={1} className="input" placeholder="Title"  autoComplete="false" value={title} onChange={(e) => handleInputChange(e, setTitle)} />
              <Error error={error} path='title' />
            </div>
            <div className="input-container">
              <label htmlFor="description">Description</label>
              <textarea className="textarea" name="description" id="description" maxLength={1000} minLength={1} style={{ height: 500 }} placeholder="Description"  autoComplete="false" value={description} onChange={(e) => handleInputChange(e, setDescription)}/>
              <Error error={error} path='description' />
            </div>
            <button disabled={disabled || error} type="submit" className="red-button" style={{ width: "50%", alignSelf: "center" }}>
              Create
            </button>
            <button className="grey-button" style={{ width: "50%", alignSelf: "center" }} onClick={(e) => {navigate('/');}}>
              Cancel
            </button>
          </div>
        </div>
      </form> */}

      <form style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 100}} onSubmit={async (e) => handleCreatePin(e)}>
        <div style={{display: "flex", flexDirection: 'column', alignItems: "center", width: "fit-content", borderRadius: 32, boxShadow: "rgb(211 211 211) 0px 0px 20px 0px"}}>
          {/* Pin */}
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{width: 1016, display: 'flex'}}>
              <div style={{position: "relative", width: 508, borderRadius: 32, padding: 20, display: "flex", flexDirection: 'column', alignItems: "center"}} >
                {pin ? (
                  <img src={pin ? URL.createObjectURL(pin) : ""} style={{width: "100%", height: "min-content", objectFit: "contain", display: "flex", borderRadius: 16, objectPosition: "top", cursor: "pointer"}} onClick={(e) => fileUpload.current.click()} />
                ) : (
                  <>
                    <div className="input" style={{width: 468, height: 512, backgroundColor: "rgb(251 251 251)", borderWidth: 3, borderColor: "#e9e9e9", borderRadius: 32, borderStyle: "dashed", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", cursor: "pointer"}} onClick={(e) => fileUpload.current.click()}>
                      <IonIcon icon={imageOutline} style={{ fontSize: 32, opacity: 0.5 }}/>
                      <div style={{ opacity: 0.9 }}>Click to add a pin</div>
                    </div>
                    <Error error={error} path='pin' />
                  </>
                )}
              </div>
              {/* Title and comments container */}
              <div style={{width: 508, display: "flex", flexDirection: "column", justifyContent: "flex-start", position: "relative", padding: 32, gap: 8}} >
                <input name="pin" ref={fileUpload} type="file" onChange={e => onImageChange(e)} style={{ display: "none" }} />
                <div className="input-container">
                  <label htmlFor="title">Title</label>
                  <input name="title" id="title" maxLength={64} minLength={1} className="input" placeholder="Title"  autoComplete="false" value={title} onChange={(e) => handleInputChange(e, setTitle)} />
                  <Error error={error} path='title' />
                </div>
                <div className="input-container">
                  <label htmlFor="description">Description</label>
                  <textarea className="textarea" name="description" id="description" maxLength={1000} minLength={1} style={{ height: 500 }} placeholder="Description"  autoComplete="false" value={description} onChange={(e) => handleInputChange(e, setDescription)}/>
                  <Error error={error} path='description' />
                </div>
              </div>
            </div>
            <button disabled={disabled || error} type="submit" className="red-button" style={{ width: "16rem", alignSelf: "center", marginBottom: 8 }}>
              Create
            </button>
            <button className="grey-button" style={{ width: "16rem", alignSelf: "center", marginBottom: 16 }} onClick={(e) => {navigate('/');}}>
              Cancel
            </button>
            
          </div>
        </div>
      </form>
    </>
  );
}
