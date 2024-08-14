import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import api from "../api"
import { IonIcon } from "@ionic/react"
import { heart, heartOutline } from "ionicons/icons"
import Error from "./Error"

export default function CommentInput({pin, setCommentsCount, commentsCount, setComments}) {
  const {isAuthenticated} = useContext(AuthContext)
  const navigate = useNavigate()

  const [comment, setComment] = useState('')
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLiked(pin?.liked);
    setLikes(pin?.likes)
  }, [pin])

  async function handleLike() {
    if(!isAuthenticated) return navigate('/login')
    const response = await api.post('/api/like', {pin_id: pin?._id})
    const liked = response.data.liked
    setLiked(liked)
    if(liked) setLikes(prev => (prev+1))
    else setLikes(prev => (prev-1))
  }

  async function handleAddComment(e) {
    e.preventDefault()
    if(!isAuthenticated) return navigate('/login')
    if(!comment) return;
    const response = await api.post('/api/comment/create', {pin_id: pin?._id, content: comment})
    const newComment = response.data.comment
    setComments(prev => [...prev, newComment])
    setComment('')
    setCommentsCount(prev => (prev+1))
  }

  return (
    <div style={{position: "sticky", bottom: 0, width: "100%", backgroundColor: "white", borderRadius: 32}}>
      <div style={{width: "100%", borderRadius: 16, height: 1, backgroundColor: "#e9e9e9", marginBottom: 32}}/>
      <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px", padding: "0px 48px"}}>
        <div style={{display: "flex", flexGrow: 1, fontWeight: 500, fontSize: "1.25rem"}}>
          {`${commentsCount} Comments`}
        </div>
        <div style={{ fontWeight: 500 }}>{likes}</div>
        <div onClick={e => handleLike()} style={{display: "flex", justifyContent: "center", alignItems: "center", cursor: 'pointer'}}>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "black", borderRadius: 360, width: "52px", height: "52px", opacity: 0, position: "absolute", zIndex: 1, transition: "all 150ms"}} onMouseLeave={(e) => {e.target.style.opacity = 0;}} onMouseEnter={(e) => {e.target.style.opacity = 0.1;}}/>
          {liked ? 
            <IonIcon icon={heart} color="danger" style={{fontSize: 32}} />
            :
            <IonIcon icon={heartOutline} style={{ fontSize: 32 }} />
          }
        </div>
      </div>
      <div style={{ padding: "32px 32px" }}>
        <form onSubmit={e => handleAddComment(e)}>
          <input value={comment} onChange={e => setComment(e.target.value)} placeholder="add a comment" />
          <Error error={error} path='content' />
        </form>
      </div>
    </div>
  )
}