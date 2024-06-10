import "./Contacts.css";
import { useState, useContext } from "react";
import AddList from "../../components/AddList/AddList";
import AllLists from "../../components/AllLists/AllLists";
import AuthContext from "../../context/AuthContext"

const Contacts = () => {
  const [showNewList, setShowNewList] = useState(false);
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const handleShowNewList = () => {
    setShowNewList(!showNewList);
  };
  const {theme} = useContext(AuthContext);

  return (
    <div className={`container-content ${theme && "dark-theme-contacts" }`}>
      <div className="contacts-title">
        <h3>Your contact lists:</h3>
        <button className="btn" onClick={handleShowNewList}>Add new</button>
      </div>
      <AllLists triggerRefetch={triggerRefetch}/>
      {showNewList && <AddList handleShowNewList={handleShowNewList} setTriggerRefetch={setTriggerRefetch} />}
    </div>
  );
};

export default Contacts;
