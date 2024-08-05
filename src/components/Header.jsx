import { useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import pinterest from "../../public/pinterest.png";
import avatar from '../../public/avatar.png'
import { IonIcon } from "@ionic/react";
import { chevronDownOutline } from "ionicons/icons";
import './styles/Header.css'
import URLs from "../url";

function Header() {
  const { isAuthenticated, user, handleLogin, handleLogout } =
    useContext(AuthContext);
  const location = useLocation()
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
      <div ref={headerRef} style={{ position: 'sticky', zIndex: 1, top: 0, backgroundColor: 'white', height: 80, width: '100%', padding: '4px 16px', display: 'flex', alignItems: 'center' }}>
        <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex', height: '100%', width: '100%', gap: 16, alignItems: 'center' }}>
          <li>
            <Link style={{ display: 'flex', gap: 1, textDecoration: 'none', fontWeight: 600, fontSize: '1.25rem', color: '#e60023' }} to='/'>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 40, height: 40, borderRadius: '50%' }} className="greybackground">
                <img src={pinterest} style={{ objectFit: "contain", borderRadius: "50%", width: '24px', zIndex: 1 }} />
              </div>
              Pinterest
            </Link>
          </li>
          <li>
            <Link to='/' style={{ fontWeight: 500, textDecoration: 'none' }}>
              Home
            </Link>
          </li>
          {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/create' && isAuthenticated &&
            <li>
              <Link to='/create' style={{ fontWeight: 500, textDecoration: 'none' }}>
                Create
              </Link>
            </li>
          }

          <div style={{ flexGrow: 1 }} />
          {isAuthenticated ?
            <>
              <li>
                <Link to={`/profile/${user._id}`} style={{ display: 'flex', gap: 16, fontSize: '1rem', textDecoration: 'none', }}>
                  {user?.name}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 40, height: 40, borderRadius: '50%' }} className="greybackground">
                    <img src={user?.avatar ? `${URLs}/avatars/${user?.avatar}` : avatar} style={{ borderRadius: "50%", width: 24, height: 24, zIndex: 1, objectFit: 'cover' }} />
                  </div>
                </Link>
              </li>
              <li className="dropdown" >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 28, height: 28, borderRadius: '50%', cursor: 'pointer' }} 
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
                  <IonIcon icon={chevronDownOutline} style={{ borderRadius: "50%", width: 24, zIndex: 1 }} />
                </div>
                <div className="dropdown-content">
                  <div style={{ color: 'red', textAlign: 'center', fontSize: '1rem', cursor: 'pointer' }} onClick={e => handleLogout()} >Logout</div>
                </div>
              </li>
            </>
            :
            <>
              <li><Link to='/login' className="a red">Login</Link></li>
              <li><Link to='/signup' className="a grey">Sign Up</Link></li>
            </>
          }
        </ul>
      </div>
    </>
  );
}

export default Header;
