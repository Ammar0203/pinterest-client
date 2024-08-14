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

export default function Pin() {
  const {user, isAuthenticated} = useContext(AuthContext)
  const { name } = useParams();
  const navigate = useNavigate()

  const [pin, setPin] = useState();
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState()
  const [edit, setEdit] = useState(false)
  const [commentsCount, setCommentsCount] = useState(0)

  useEffect(() => {
    async function fetchComments(pin_id) {
      const response = await api.get(`/api/comment?pin_id=${pin_id}`)
      const { comments } = response.data
      setComments(comments)
    }
    async function fetchImage() {
      const response = await api.get(`/api/pin/${name}`);
      const { pin } = response.data
      setPin(pin);
      setCommentsCount(pin.comments)
      // setDescription(pin.description)
      // setTitle(pin.title)
      fetchComments(pin._id)
    }

    fetchImage();
  }, [user]);

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
          {/* Pin */}
          <div style={{width: 508, borderRadius: 32, padding: 20}}>
            <img src={`${API_URL}/pins/${name}`} style={{width: "100%", objectFit: "contain", display: "flex", borderRadius: 16}}/>
          </div>
          {/* Title and comments container */}
          {edit ? 
            <EditPin setEdit={setEdit} setPin={setPin} pin={pin} />
            : 
            <div style={{width: 508, display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative"}}>
              {/* Title and description and comments section */}
              <div style={{ margin: 32, marginTop: 20, flexGrow: 1 }}>
                <div style={{flexGrow: 1, overflow: "auto"}}>
                  {/* title */}
                  {user?._id === pin?.user?._id && 
                    <div style={{display: 'flex', height: 'min-content', gap: 16, justifyContent: 'flex-end'}}>
                      <div className="button grey" onClick={e => setEdit(true)} style={{cursor: 'pointer'}} >Edit</div>
                      <div className="button red" style={{cursor: 'pointer'}} onClick={(e) => handleDeletePin()}>Delete</div>
                    </div>
                  }
                  <div className="Pin-title-ellipsis" style={{ marginBottom: 16 }}>{pin?.title}</div>
                  {/* description */}
                  <div className="Pin-description-ellipsis">
                    {pin?.description}
                    {/* <div style={{ cursor : 'pointer', color:'#3880FF'}}>Read more</div> */}
                  </div>
                  {/* user pic + name */}
                  <div style={{display: "flex", alignItems: "center", gap: 16, margin: "24px 0", cursor: 'pointer'}} onClick={e => navigate(`/profile/${pin?.user?._id}`)}>
                    <img src={pin?.user?.avatar? `${API_URL}/avatars/${pin?.user?.avatar}` : avatar} style={{ borderRadius: "50%", width: 48, height: 48, objectFit: 'cover' }}/>
                    <div style={{ fontSize: "1.25rem", fontWeight: 400 }}>{pin?.user?.name}</div>
                  </div>
                  {/* comments */}
                  <div style={{ display: "flex", marginBottom: 16, cursor: 'pointer' }} onClick={e => setShowComments(prev => !prev)}>
                    <div style={{ fontWeight: 600 }}>Comments</div>
                    <IonIcon icon={showComments ? chevronDownOutline : chevronUpOutline} style={{ margin: "0 0 0 auto", fontSize: 28 }}/>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }} >
                    {showComments && comments?.map(comment => (
                      <div key={comment._id} style={{ display: "flex" }}>
                        <img src={comment?.user?.avatar? `${API_URL}/avatars/${comment?.user?.avatar}` : avatar} style={{borderRadius: "50%", width: 32, height: 32, marginRight: 8, objectFit: 'cover'}}/>

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
              {/* Input comment bar */}
              <CommentInput pin={pin} commentsCount={commentsCount} setCommentsCount={setCommentsCount} setComments={setComments} />
            </div>
          }
        </div>
      </div>
    </>
  );
}
