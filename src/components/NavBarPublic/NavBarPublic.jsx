import "./NavBarPublic.css"
import { assets } from "../../assets/assets"

const NavBarPublic = () => {
  return (
    <>
    <div className="nav-bar-public">
        <div className="nav-bar-public-logo">
            <img src={assets.logo} alt="logo" />
        </div>
        <div className="nav-bar-public-menu">
            <a id="loginBtn" href="/login">Log in</a>
            <a id="registerBtn" href="/signup">Get started</a>
        </div>
    </div>
    <hr />
    </>
  )
}

export default NavBarPublic