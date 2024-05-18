import "./Contacts.css";
import { useState } from "react";

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
          <p>Petkoe213</p>
        </div>
      </div>
      <div className="container-list-form">
        {showNewList ? (
          <div className="add-list">
            <div className="add-list__header">
              <span className="add-list__title">New list</span>
              <button onClick={handleShowNewList} className="button--icon">x</button>
            </div>
            <div className="add-list__body">
              <div className="input">
                <label className="input__label">List name</label>
                <input className="input__field" type="text" placeholder="Enter list name" />
              </div>
              <div className="input">
                <label className="input__label">Members</label>
                <input className="input__field" type="search" placeholder="Add members by email" />
              </div>
            </div>
            <div className="container-find-contact">
              <div className="single-contact">
                <div>
                  <img src="https://picsum.photos/40/40"></img>
                </div>
                <div>
                  <p>petko1234@gmail.com</p>
                </div>
                <button>Add</button>
              </div>
            </div>
            <div className="add-list__footer">
              <button className="button--primary">Create list</button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Contacts;
