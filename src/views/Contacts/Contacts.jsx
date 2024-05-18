import "./Contacts.css";
import { useState } from "react";
import AddList from "../../components/AddList/AddList";

const Contacts = () => {
  const [showNewList, setShowNewList] = useState(false);

  const handleShowNewList = () => {
    setShowNewList(!showNewList);
  };

  return (
    <div className="contacts-container">
      <div className="contacts-title">
        <h3>Your contact lists:</h3>
        <button onClick={handleShowNewList}>Add contact list</button>
      </div>
      <div className="all-lists">
        <div className="single-list">
          <div><p>My team</p></div>
          <div className="notifier">
          <i className="fa-solid fa-user-group"></i>
          <div className="badge">3</div>
          </div>
        </div>  
      </div>
      <AddList showNewList={showNewList} handleShowNewList={handleShowNewList} />
    </div>
  );
};

export default Contacts;
