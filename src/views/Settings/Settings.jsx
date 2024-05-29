import "./Settings.css"
import Theme from "../../components/SettingsOptions/Theme/Theme"
import Preferences from "../../components/SettingsOptions/Preferences/Preferences"
import MoreOptions from "../../components/SettingsOptions/MoreOptions/MoreOptions"

const Settings = () => {
    return (
        <div className="container-content">
            <div className="settings-container">
                <Theme />
                <Preferences />
                <MoreOptions />
            </div>
        </div>
    )
}

export default Settings