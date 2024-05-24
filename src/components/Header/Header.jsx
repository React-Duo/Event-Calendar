import "./Header.css";
import { assets } from "../../assets/assets";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { getUserDetails } from "../../service/database-service";

const Header = () => {
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  //Todo: Change the photo dinamically when the user changes it form profile
  useEffect(() => {
    if (isLoggedIn.status) {
      const fetchUserDetails = async () => {
        try {
          const userDetails = await getUserDetails(isLoggedIn.user);
          setPhoto(userDetails[0].photo);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUserDetails();
    }
  }, [isLoggedIn.status, isLoggedIn.user]);

  const handleLoginClick = (event) => {
    event.preventDefault();
    navigate(`/login`);
  }

  const handleRegisterClick = (event) => {
    event.preventDefault();
    navigate(`/register`);
  }

  const handleLogoutClick = (event) => {
    event.preventDefault();
    navigate(`/logout`);
  }

  return (
    <>
      <div className="header">
        
        {!isLoggedIn.status ? (
          <>
          <div className="header-logo">
          <img src={assets.logo} alt="logo" />
        </div>
          <div className="header-menu">
            <a id="loginBtn" href="#" onClick={handleLoginClick}>
              Log in
            </a>
            <a id="registerBtn" href="#" onClick={handleRegisterClick}>
              Get started
            </a>
          </div>
          </>
        ) : (
          <div className="header-menu">
            <div className="notifier new">
              <i className="bell fa fa-bell-o"></i>
              <div className="badge">5</div>
            </div>
            <div className="header-person">
              <div className="options-header">
                <img
                  onClick={() => navigate("/profile")}
                  src={photo}
                ></img>
              </div>
              <p>{isLoggedIn.user}</p>
              <i  className="fa-solid fa-chevron-down fa-sm"></i>
              <div className="options">
                  <button onClick={() => navigate("/profile")} className="value"><i className="fa-regular fa-user fa-sm"></i>Public profile</button>
                  <button onClick={() => navigate("/settings")} className="value"><i className="fa-solid fa-gear fa-sm"></i>Settings</button>
                  <button className="value" onClick={handleLogoutClick}><i className="fa-solid fa-arrow-right-from-bracket fa-sm"></i>Log out</button>
                </div>
            </div>
          </div>
        )}
      </div>
      <hr />
    </>
  );
};

export default Header;
