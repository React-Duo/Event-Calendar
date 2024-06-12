import "./Settings.css"
import Theme from "../../components/SettingsOptions/Theme/Theme"
import Preferences from "../../components/SettingsOptions/Preferences/Preferences"
import MoreOptions from "../../components/SettingsOptions/MoreOptions/MoreOptions"
import { useContext } from "react"
import AuthContext from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Settings = () => {
    const {theme} = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className={`container-content ${theme && "dark-theme-contacts" }`}>
            <div className="settings-container">
                <Theme />
                <Preferences />
                <h2 id="about-us-h2-el" onClick={()=> navigate("/about-us")}>About us</h2>
                <MoreOptions />
            </div>
        </div>
    )
}

export default Settings