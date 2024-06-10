import "./Settings.css"
import Theme from "../../components/SettingsOptions/Theme/Theme"
import Preferences from "../../components/SettingsOptions/Preferences/Preferences"
import MoreOptions from "../../components/SettingsOptions/MoreOptions/MoreOptions"
import { useContext } from "react"
import AuthContext from "../../context/AuthContext"

const Settings = () => {
    const {theme} = useContext(AuthContext);

    return (
        <div className={`container-content ${theme && "dark-theme-contacts" }`}>
            <div className="settings-container">
                <Theme />
                <Preferences />
                <MoreOptions />
            </div>
        </div>
    )
}

export default Settings