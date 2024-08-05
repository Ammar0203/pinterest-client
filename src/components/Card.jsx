import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { IonIcon } from "@ionic/react";
import { chatbubbleOutline, heart, heartOutline } from "ionicons/icons";
import './styles/Cards.css'
import URLs from "../url";

export default function Card({pin, innerRef}) {
  const {isAuthenticated, handleLike} = useContext(AuthContext)
  const navigate = useNavigate()
  const { width, height, name, title } = pin;
  const pinRows = Math.floor(height / (width / 236) / 10);
  const rows = pinRows > 51 ? 51 : pinRows;
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(pin.likes)
  useEffect(() => {
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
  return (
    <div
      onClick={() => navigate(`/pin/${name}`)}
      className="Home-card"
      style={{ gridRowEnd: `span ${rows}`, cursor: 'zoom-in' }}
    >
      <div className="Home-img-background"></div>
      <div className="Home-img-layout">
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
        src={`${URLs}/pins/${name}`}
        className="Home-img"
      />
    </div>
  );
}