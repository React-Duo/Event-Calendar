import "./Header.css"
import { assets } from "../../assets/assets"

const Header = () => {
  return (
    <>
    <div className="header">
        <div className="header-logo">
            <img src={assets.logo} alt="logo" />
        </div>
        <div className="header-menu">
            <a id="loginBtn" href="/login">Log in</a>
            <a id="registerBtn" href="/signup">Get started</a>
        </div>
    </div>
    <hr />
    </>
  )
}

export default Header