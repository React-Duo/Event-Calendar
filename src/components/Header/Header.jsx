import { useNavigate } from 'react-router-dom';
import "./Header.css"
import { assets } from "../../assets/assets"

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = (event) => {
    event.preventDefault();
    navigate(`/login`);
  }

  const handleRegisterClick = (event) => {
    event.preventDefault();
    navigate(`/register`);
  }

  return (
    <>
    <div className="header">
        <div className="header-logo">
            <img src={assets.logo} alt="logo" />
        </div>
        <div className="header-menu">
            <a id="loginBtn" href="#" onClick={handleLoginClick}>Log in</a>
            <a id="registerBtn" href="#" onClick={handleRegisterClick}>Get started</a>
        </div>
    </div>
    <hr />
    </>
  )
}

export default Header