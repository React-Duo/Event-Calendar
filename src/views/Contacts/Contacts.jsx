import "./Contacts.css";
import { useState } from "react";
import AddList from "../../components/AddList/AddList";
import AllLists from "../../components/AllLists/AllLists";

const Contacts = () => {
  const [showNewList, setShowNewList] = useState(false);
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const handleShowNewList = () => {
    setShowNewList(!showNewList);
  };

  return (
    <div className="contacts-container">
      <div className="contacts-title">
        <h3>Your contact lists:</h3>
        <button className="btn" onClick={handleShowNewList}>Add new</button>
      </div>
      <AllLists triggerRefetch={triggerRefetch}/>
      <AddList showNewList={showNewList} handleShowNewList={handleShowNewList} setTriggerRefetch={setTriggerRefetch} />
    </div>
  );
};

export default Contacts;
