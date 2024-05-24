import "./ProfileEdit.css";
import { useRef, useContext, useEffect, useState } from "react";
import { getUserDetails, editCredential } from "../../service/database-service";
import AuthContext from "../../context/AuthContext";
import {
  NAME_MIN_CHARS, NAME_MAX_CHARS,
  PASSWORD_MIN_CHARS, PASSWORD_MAX_CHARS,
  PHONE_REGEX, PHONE_DIGITS, ADDRESS_MIN_CHARS, ADDRESS_MAX_CHARS, ADDRESS_REGEX,
  DIGIT_REGEX, LETTER_REGEX, SPECIAL_CHARS_REGEX
} from '../../common/constants.js';
import { changePassword } from "../../service/authentication-service";

const ProfileEdit = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const fileInput = useRef(null);
  const [password, setPassword] = useState("");

  const handleImageClick = () => {
    fileInput.current.click();
  };

  const [userDetails, setUserDetails] = useState({
    username: "",
    firstName: "",
    lastName: "",
    photo: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
  }, [userDetails]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails(isLoggedIn.user);
        setUserDetails({
          username: userDetails[0].username,
          firstName: userDetails[0].firstName,
          lastName: userDetails[0].lastName,
          photo: userDetails[0].photo,
          phone: userDetails[0].phone,
          address: userDetails[0].address,
        })
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserDetails();
  }, [isLoggedIn.user]);

  const handleInputChange = async (name, value) => {
    switch (name) {
      case "lastName":
      case "firstName":
        if (
          value.length < NAME_MIN_CHARS ||
          value.length > NAME_MAX_CHARS ||
          DIGIT_REGEX.test(value) ||
          SPECIAL_CHARS_REGEX.test(value) ||
          !LETTER_REGEX.test(value)
        ) {
          setError(
            `First name must not contain special characters or digits and must be between ${NAME_MIN_CHARS} and ${NAME_MAX_CHARS} characters long.`
          );
          setSuccess(null);
          return;
        }
        break;
      case "phone":
        if (!PHONE_REGEX.test(value)) {
          setError(
            `Phone number must contain ${PHONE_DIGITS} digits exactly.`
          );
          setSuccess(null);
          return;
        }
        break;
      case "address":
        if (!ADDRESS_REGEX.test(value)) {
          setError(`Address must contain ${ADDRESS_MIN_CHARS}-${ADDRESS_MAX_CHARS} characters, uppercase/lowercase letters, digits and space/dot.`);
          return;
        }

    }

    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    await editCredential(userDetails.username, name, value);
    setSuccess("Success! Profile updated.");
    setError(null);
  };

  const editPassword = async (password) => {
    console.log(password)
    if (password.length < PASSWORD_MIN_CHARS || password.length > PASSWORD_MAX_CHARS || !LETTER_REGEX.test(password)
      || !DIGIT_REGEX.test(password) || !SPECIAL_CHARS_REGEX.test(password)) {
      setError(
        `Password must be at least:8 characters, ONE digit, ONE letter, ONE special symbol`
      );
      setSuccess(null);
      return;
    }
    await changePassword(password)
    setSuccess("Success password changed");
    setError(null);
  }

  return (
    <div>
      <div className="container-profile-edit">
        <div className="profile-edit__body">
          <div className="profile-edit-title">
            <h3>Profile Settings</h3>
            <p>Update your profile information here.</p>
          </div>
          <div className="img-change">
            <img onClick={handleImageClick} src="https://picsum.photos/100/100"></img>
            <input
              type="file"
              style={{ display: 'none' }}
              ref={fileInput}
            />
            <button className="btn">Change</button>
          </div>
          {error && <div className="profile-errorMessage">{error}</div>} <br />
            {success && <div className="profile-confirmMessage">{success}</div>} <br />
          <div className="input">
            <label className="input__label">First Name</label>
            <input
              onChange={(e) => setUserDetails((prevDetails) => ({ ...prevDetails, firstName: e.target.value }))}
              className="input__field"
              type="text"
              placeholder={userDetails.firstName}
            />
            <button onClick={() => handleInputChange("firstName", userDetails.firstName)} className="btn">Change</button>
          </div>
          <div className="input">
            <label className="input__label">Last Name</label>
            <input
              onChange={(e) => (userDetails.lastName = e.target.value)}
              className="input__field"
              type="text"
              placeholder={userDetails.lastName}
            />
            <button onClick={() => handleInputChange("lastName", userDetails.lastName)} className="btn"> Change</button>
          </div>
          <div className="input">
            <label className="input__label">Password</label>
            <input
              onChange={(e) => { setPassword(e.target.value) }}
              className="input__field"
              type="password"
              placeholder="*******"
            />
            <button onClick={() => editPassword(password)} className="btn"> Change</button>
          </div>
            
          <div>
            <h3>Contacts</h3>
          </div>

          <div className="input">
            <label className="input__label">Phone</label>
            <input
              onChange={(e) => (userDetails.phone = e.target.value)}
              className="input__field"
              type="tel"
              placeholder={userDetails.phone}
            />
            <button onClick={() => handleInputChange('phone', userDetails.phone)} className="btn"> Change</button>
          </div>
          <div className="input">
            <label className="input__label">Location</label>
            <input
              onClick={(e) => (userDetails.address = e.target.value)}
              className="input__field"
              type="text"
              placeholder={userDetails.address}
            />
            <button onClick={() => handleInputChange('address', userDetails.address)} className="btn"> Change</button>
          </div>
          <div>
            <h3>Delete Profile</h3>
            <p>Delete your account and all of your source data.This is irreversible.</p>
          </div>
          <div><button className="delete-btn">Delete</button></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
