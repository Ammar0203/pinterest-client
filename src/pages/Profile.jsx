import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import api from "../api";
import avatar from "../../public/avatar.png";
import Header from "../components/Header";
import Cards from "../components/Cards";
import API_URL from "../url";
import Avatar from "../components/Avatar";

export default function Profile() {
  const { _id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [profile, setProfile] = useState();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get(`/api/user/${_id}`);
        const profile = response.data.user
        setProfile(profile);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProfile();
  }, [_id, user]);

  return (
    <>
      <Header />
      <div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16, margin: '20px'}}>
          <Avatar src={profile?.avatar} style={{width: 120, height: 120}} />
          <div style={{ fontSize: "36px" }}>{profile?.name}</div>
          <div style={{width: '100%', height: 1, backgroundColor: '#e9e9e9'}} />
        </div>
        <Cards query={_id}/>
      </div>
    </>
  );
}
