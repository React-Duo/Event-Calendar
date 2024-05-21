import "./Header.css";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const Header = () => {

  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);


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
                  src="https://picsum.photos/50/50"
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
