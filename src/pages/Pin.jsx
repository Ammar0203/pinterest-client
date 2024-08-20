import { IonIcon } from "@ionic/react";
import Header from "../components/Header";
import {
  arrowBackOutline,
  chevronDownOutline,
  chevronUpOutline,
} from "ionicons/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import api from "../api";
import avatar from "../../public/avatar.png";
import { AuthContext } from "../contexts/AuthContext";
import API_URL from "../url";
import EditPin from "../components/EditPin";
import CommentInput from "../components/CommentInput";
import Avatar from "../components/Avatar";

export default function Pin() {
  const {user} = useContext(AuthContext)
  const { _id } = useParams();
  const navigate = useNavigate()

  const [pin, setPin] = useState();
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState()
  const [edit, setEdit] = useState(false)
  const [commentsCount, setCommentsCount] = useState(0)
  const [image, setImage] = useState(null)

  useEffect(() => {
    async function fetchComments() {
      const response = await api.get(`/api/comment?pin_id=${_id}`)
      const { comments } = response.data
      setComments(comments)
    }
    fetchComments()
    async function fetchPin() {
      const response = await api.get(`/api/pin/${_id}`);
      const { pin } = response.data
      setPin(pin);
      setCommentsCount(pin.comments)
    }
    fetchPin();
    async function fetchImage() {
      try {
        const response = await api.get(`/api/pin/image/${_id}`)
        setImage(response.data.image)
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchImage()
  }, []);

  async function handleDeleteComment(e, comment) {
    try {
      const response = await api.post(`/api/comment/delete`, {comment})
      e.target.parentElement.parentElement.style.display = 'none'
      setCommentsCount(prev => (prev-1))
    }
    catch (err) {
      console.log(err)
    }
  }

  async function handleDeletePin() {
    try {
      const response = await api.post('/api/pin/delete', {pin_id: pin?._id})
      navigate('/')
    }
    catch(err) {
      console.log(err)
    }
  }

  return (
    <>
      <Header />
      <div style={{display: "flex", alignItems: "center", margin: "0 1rem", gap: "1rem", width: "fit-content"}}>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", cursor: 'pointer'}} onClick={e => navigate('/')}>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", borderRadius: 360, width: "1.8rem", height: "1.8rem", opacity: 0, position: "absolute", zIndex: 1, transition: "all 150ms"}} onMouseLeave={(e) => {e.target.style.opacity = 0;}} onMouseEnter={(e) => {e.target.style.opacity = 0.1;}}/>
          <IonIcon icon={arrowBackOutline} />
        </div>
        <h3 style={{ fontWeight: 600 }}>Back</h3>
      </div>

      <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 100}}>
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", width: "fit-content", borderRadius: 32, boxShadow: "rgb(211 211 211) 0px 0px 20px 0px"}}>
          <div style={{width: 508, borderRadius: 32, padding: 20}}>
            <img src={image?.image} style={{width: "100%", objectFit: "contain", display: "flex", borderRadius: 16}}/>
          </div>
          {edit ? 
            <EditPin setEdit={setEdit} setPin={setPin} pin={pin} />
            : 
            <div style={{width: 508, display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative"}}>
              <div style={{ margin: 32, marginTop: 20, flexGrow: 1 }}>
                <div style={{flexGrow: 1, overflow: "auto"}}>
                  {user?._id === pin?.user?._id && 
                    <div style={{display: 'flex', height: 'min-content', gap: 16, justifyContent: 'flex-end'}}>
                      <button className="red-button" onClick={e => setEdit(true)} style={{cursor: 'pointer'}} >Edit</button>
                      <button className="grey-button" style={{cursor: 'pointer'}} onClick={(e) => handleDeletePin()}>Delete</button>
                    </div>
                  }
                  <div className="Pin-title-ellipsis" style={{ marginBottom: 16 }}>{pin?.title}</div>
                  <div className="Pin-description-ellipsis">
                    {pin?.description}
                  </div>
                  <div style={{display: "flex", alignItems: "center", gap: 16, margin: "24px 0", cursor: 'pointer'}} onClick={e => navigate(`/profile/${pin?.user?._id}`)}>
                    <Avatar src={pin?.user?.avatar} style={{width: 48, height: 48}} />
                    <div style={{ fontSize: "1.25rem", fontWeight: 400 }}>{pin?.user?.name}</div>
                  </div>
                  <div style={{ display: "flex", marginBottom: 16, cursor: 'pointer' }} onClick={e => setShowComments(prev => !prev)}>
                    <div style={{ fontWeight: 600 }}>Comments</div>
                    <IonIcon icon={showComments ? chevronDownOutline : chevronUpOutline} style={{ margin: "0 0 0 auto", fontSize: 28 }}/>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }} >
                    {showComments && comments?.map(comment => (
                      <div key={comment._id} style={{ display: "flex" }}>
                        <Avatar src={comment?.user?.avatar} style={{width: 32, height: 32, marginRight: 8}} />
                        <div style={{ wordBreak: "break-all" }}>
                          <span style={{ fontWeight: 500, margin: "0 8px 0 0" }}>
                            {comment?.user?.name}
                          </span>
                          {comment?.content}
                        </div>
                        {
                          user?._id === comment?.user?._id && <div style={{marginLeft: 'auto', paddingLeft: 8}}><div style={{color: "red", cursor: 'pointer'}} onClick={(e) => handleDeleteComment(e, comment)}>delete</div></div>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <CommentInput pin={pin} commentsCount={commentsCount} setCommentsCount={setCommentsCount} setComments={setComments} />
            </div>
          }
        </div>
      </div>
    </>
  );
}
