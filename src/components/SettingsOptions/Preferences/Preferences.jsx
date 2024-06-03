import "./Preferences.css"
import { useState, useContext, useEffect } from "react"
import { editCredential, getUserDetails } from "../../../service/database-service";
import AuthContext from "../../../context/AuthContext";

const Preferences = () => {

  const { isLoggedIn } = useContext(AuthContext);
  const [invitePreference, setInvitePreference] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    const getUser = async () => {
      const userDetails = await getUserDetails(isLoggedIn.user);
      if (userDetails[0].invitePreference) {
        setInvitePreference(true);
      }
      setUserDetails(userDetails[0]);
    }
    getUser();
  }, [isLoggedIn.user]);


  const handleCheckboxChange = async (event) => {
    if (event.target.checked) {
      await editCredential(userDetails.username, "invitePreference", "true")
      setInvitePreference(true);
    } else {
      await editCredential(userDetails.username, "invitePreference", null)
      setInvitePreference(false);
    }
  };

  return (
    <div>
      <h2>Preferences</h2>
      <div className="preference">
        <label htmlFor="invite-preference">Dont invite me to an event unless I allow it:</label>
        <input 
          type="checkbox" 
          id="invite-preference" 
          name="invite-preference" 
          checked={invitePreference} 
          onChange={handleCheckboxChange} 
        />
      </div>
    </div>
  )
}

export default Preferences;