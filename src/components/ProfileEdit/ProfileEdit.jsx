import "./ProfileEdit.css";
import { useRef } from "react";

const ProfileEdit = () => {
  const fileInput = useRef(null);

  const handleImageClick = () => {
    fileInput.current.click();
  };

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
              style={{display: 'none'}} 
              ref={fileInput}
            />
            <button className="btn">Change</button>
          </div>
          <div className="input">
            <label className="input__label">First Name</label>
            <input
              className="input__field"
              type="text"
              placeholder="Enter your name"
            />
            <button className="btn">Change</button>
          </div>
          <div className="input">
            <label className="input__label">Second Name</label>
            <input
              className="input__field"
              type="text"
              placeholder="Enter your name"
            />
            <button className="btn"> Change</button>
          </div>
          <div>
            <h3>Contacts</h3>
          </div>
          <div className="input">
            <label className="input__label">Email</label>
            <input
              className="input__field"
              type="email"
              placeholder="Enter your email"
            />
            <button className="btn"> Change</button>
          </div>
          <div className="input">
            <label className="input__label">Phone</label>
            <input
              className="input__field"
              type="tel"
              placeholder="Enter your password"
            />
            <button className="btn"> Change</button>
          </div>
          <div className="input">
            <label className="input__label">Location</label>
            <input
              className="input__field"
              type="password"
              placeholder="Confirm your password"
            />
            <button className="btn"> Change</button>
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
