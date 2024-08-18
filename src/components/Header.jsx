import { useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import pinterest from "../../public/pinterest.png";
import avatar from '../../public/avatar.png'
import { IonIcon } from "@ionic/react";
import { chevronDownOutline } from "ionicons/icons";
import API_URL from "../url";
import Avatar from "./Avatar";

function Header() {
  const { isAuthenticated, user, handleLogout } = useContext(AuthContext);
  
  const location = useLocation()
  const navigate = useNavigate()

  const headerRef = useRef();

  useEffect(() => {
    const e = document.addEventListener("scroll", () => {
      if (headerRef.current?.offsetTop > 0)
        headerRef.current.style.boxShadow =
          "rgba(0, 0, 0, 0.1) 0px 8px 8px -8px";
      else if (headerRef.current?.offsetTop <= 0) {
        headerRef.current.style.boxShadow = "";
      }
    });
    return () => e;
  }, []);

  return (
    <>
      <div ref={headerRef} style={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'white', height: 80, width: '100%', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center' }}>
        <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex', height: '100%', width: '100%', gap: '1rem', alignItems: 'center' }}>
          <li>
            <Link className="a" style={{ display: 'flex', textDecoration: 'none', fontWeight: 600, fontSize: '1.25rem', color: '#e60023' }} to='/'>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: '2.5rem', height: '2.5rem', borderRadius: '50%' }}>
                <img src={pinterest} style={{ objectFit: "contain", borderRadius: "50%", width: '1.5rem', height: '1.5rem', zIndex: 1 }} />
              </div>
              Pinterest
            </Link>
          </li>
          <li>
            <Link className="a" to='/' style={{ fontWeight: 500, textDecoration: 'none' }}>
              Home
            </Link>
          </li>
          {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/create' && isAuthenticated &&
            <li>
              <Link className="a" to='/create' style={{ fontWeight: 500, textDecoration: 'none' }}>
                Create
              </Link>
            </li>
          }

          <div style={{ flexGrow: 1 }} />

          {isAuthenticated ?
            <>
              <li>
                <Link className="a" to={`/profile/${user?._id}`} style={{ display: 'flex', fontSize: '1rem', textDecoration: 'none', }}>
                  {user?.name}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: '2.5rem', height: '2.5rem', borderRadius: '50%' }}>
                    <Avatar src={user?.avatar} style={{width: '1.5rem', height: '1.5rem'}} />
                  </div>
                </Link>
              </li>
              <li className="dropdown" >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: '1.75rem', height: '1.75rem', borderRadius: '50%', cursor: 'pointer' }} 
                  onClick={(e) => {
                    const dropdownContent = document.querySelector('.dropdown-content');
                    if(dropdownContent.style.display == 'block') {
                      dropdownContent.style.display = 'none'
                    } else {
                      dropdownContent.style.display = 'block'
                    }
                  }} 
                  className="greybackground"
                >
                  <IonIcon icon={chevronDownOutline} style={{ borderRadius: "50%", width: '1.5rem', zIndex: 1 }} />
                </div>
                <div className="dropdown-content">
                  <div style={{ textAlign: 'center', fontSize: '1rem', cursor: 'pointer' }} onClick={e => navigate('/profile/update')} >Update Profile</div>
                  <div style={{ textAlign: 'center', fontSize: '1rem', cursor: 'pointer' }} onClick={e => navigate('/profile/password')} >Change Password</div>
                  <div style={{ color: 'red', textAlign: 'center', fontSize: '1rem', cursor: 'pointer' }} onClick={e => handleLogout()} >Logout</div>
                </div>
              </li>
            </>
            :
            <>
              <li><Link to='/login' className="button red">Login</Link></li>
              <li><Link to='/signup' className="button grey">Sign Up</Link></li>
            </>
          }
        </ul>
      </div>
    </>
  );
}

export default Header;
