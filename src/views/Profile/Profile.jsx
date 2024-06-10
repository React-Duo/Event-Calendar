import "./Profile.css"
import ProfileEdit from "../../components/ProfileEdit/ProfileEdit"
import { useContext } from "react"
import AuthContext from "../../context/AuthContext"


const Profile = () => {
  const {theme} = useContext(AuthContext);

  return (
    <div className={`container-content ${theme && "dark-theme-profile" }`}>

      <ProfileEdit />
    </div>
  )
}

export default Profile