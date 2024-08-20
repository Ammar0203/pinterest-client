import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { IonIcon } from "@ionic/react";
import { chatbubbleOutline, heart, heartOutline } from "ionicons/icons";
import API_URL from "../url";

export default function Card({pin, innerRef}) {
  const {isAuthenticated} = useContext(AuthContext)
  const navigate = useNavigate()
  const { width, height, _id, title } = pin;
  const pinRows = Math.floor(height / (width / 236) / 10);
  const rows = pinRows > 51 ? 51 : pinRows;
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(pin.likes)
  const [image, setImage] = useState(null)

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await api.get(`/api/pin/image/light/${pin?._id}`)
        setImage(response.data.image)
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchImage()
    async function fetchIfLiked() {
      try {
        if(!isAuthenticated) return
        const response = await api.get(`/api/like/${pin._id}`)
        const {liked} = response.data
        setLiked(liked)
      }catch (err) {
        console.log(err)
      }
    }
    fetchIfLiked()
  }, [])

  async function handleLike() {
    if(!isAuthenticated) return navigate('/login')
    api.post('/api/like', {pin_id: pin?._id})
    if(!liked) setLikes(prev => (prev+1))
    else setLikes(prev => (prev-1))
    setLiked(prev => !prev)
  }

  return (
    <div
      onClick={() => navigate(`/pin/${_id}`)}
      className="Cards-card"
      style={{ gridRowEnd: `span ${rows}`, cursor: 'zoom-in' }}
    >
      <div className="Cards-img-background"></div>
      <div className="Cards-img-layout">
        <div style={{color: 'inherit', width: '100%', flexGrow: '1'}}>
          <div style={{color: 'inherit', fontSize: '1rem', display: 'inline-block', cursor: 'auto'}} onClick={(e) => e.stopPropagation()}>
            {title}
          </div>
        </div>
        <div style={{color: 'inherit', display: 'flex', justifyContent: 'flex-end'}}>
          <div style={{color: 'inherit', marginLeft: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{color: 'inherit'}}>
                <IonIcon icon={chatbubbleOutline} style={{color: 'inherit', fontSize: 22, cursor: 'pointer'}} />
            </div>
            <div style={{color: 'inherit', fontSize: '1rem', cursor: 'auto'}} onClick={(e) => e.stopPropagation()}>{pin.comments}</div>
          </div>

          <div style={{color: 'inherit', marginLeft: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{color: 'inherit', zIndex: 98, cursor: 'pointer'}} 
              onClick={async (e) => {
                e.stopPropagation();
                if(!isAuthenticated) return navigate('/login')
                await handleLike(pin._id, setLiked, setLikes)
              }}
            >
              {liked 
                ?
                <IonIcon icon={heart} color="danger" style={{fontSize: 24}} />
                :
                <IonIcon icon={heartOutline} style={{color: 'inherit', fontSize: 24}}/>
              }
            </div>
            <div style={{color: 'inherit', fontSize: '1rem', cursor: 'auto'}} onClick={(e) => e.stopPropagation()}>{likes}</div>
          </div>
        </div>
      </div>
      <img
        ref={innerRef}
        // src={`${API_URL}/pins/${name}`}
        src={image?.image}
        className="Cards-img"
      />
    </div>
  );
}