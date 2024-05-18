import "./Header.css";
import { assets } from "../../assets/assets";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="header">
        <div className="header-logo">
          <img src={assets.logo} alt="logo" />
        </div>
        {!loggedIn ? (
          <div className="header-menu">
            <a id="loginBtn" href="/login">
              Log in
            </a>
            <a id="registerBtn" href="/signup">
              Get started
            </a>
          </div>
        ) : (
          <div className="header-menu">
            <div className="notifier new">
              <i className="bell fa fa-bell-o"></i>
              <div className="badge">5</div>
            </div>
            <div className="header-person">
              <img onClick={()=> navigate("/profile")} src="https://picsum.photos/50/50"></img>
              <p>petkozlatilov1234@gmail.com</p>
            </div>
          </div>
        )}
      </div>
      <hr />
    </>
  );
};

export default Header;
