import "./SideBar.css"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { assets } from "../../assets/assets";
import AuthContext from "../../context/AuthContext";

const SideBar = () => {
  const navigate = useNavigate();
  const { theme } = useContext(AuthContext);

  const currentPath = window.location.pathname;

  return (
    <div className={`side-bar-container ${theme && "dark-theme-sideBar"}`}>
      <ul className="side-bar-tags">
        <img onClick={() => {
          navigate("/home");
          window.scrollTo(0, 0);
        }} src={assets.logo}></img>
        <li className={currentPath === "/home" ? "activePath" : ""} onClick={() => navigate("/home")}><i className="fa-solid fa-house fa-xl"></i>Home</li>
        <li className={currentPath === "/calendar" ? "activePath" : ""} onClick={() => navigate("/calendar")}><i className="fa-solid fa-calendar-days fa-xl"></i>Calendar</li>
        <li className={currentPath === "/add-event" ? "activePath" : ""} onClick={() => navigate("/add-event")}><i className="fa-solid fa-square-check fa-xl"></i>Add Event</li>
        <li className={currentPath === "/contacts" ? "activePath" : ""} onClick={() => navigate("/contacts")}><i className="fa-solid fa-address-book fa-xl"></i>Contacts</li>
      </ul>
    </div>
  );
}

export default SideBar