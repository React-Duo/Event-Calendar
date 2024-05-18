import "./Contacts.css";
import { useState } from "react";
import AddList from "../../components/AddList/AddList";
import AllLists from "../../components/AllLists/AllLists";

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
      <AllLists />
      <AddList showNewList={showNewList} handleShowNewList={handleShowNewList} />
    </div>
  );
};

export default Contacts;
