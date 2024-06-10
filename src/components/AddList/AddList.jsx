import "./AddList.css";
import PropTypes from "prop-types";
import { addList } from "../../service/database-service.js";
import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import SearchUsers from "../SearchUsers/SearchUsers";

const AddList = ({  handleShowNewList, setTriggerRefetch }) => {
  const [listName, setListName] = useState("");
  const [showError, setShowError] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [listColor, setListColor] = useState("#dddddd");


  const submitList = async () => {
    const newList = {
      name: listName,
      contacts: members,
      owner: isLoggedIn.user,
      color: listColor,
      messages: [
       {
        name: isLoggedIn.user,
        message: "Welcome to the chat",
       }
      ]
    };
    if (listName === "") {
      setShowError(true);
      return;
    }
    await addList(newList);
    setTriggerRefetch((prev) => !prev);
    exitForm();
  };

  const exitForm = () => {
    handleShowNewList();
    setListName("");
    setMembers([]);
    setShowError(false);
    setListColor("#dddddd");
  };

  return (
    <div>
      <div className="container-list-form">
          <div className="add-list">
            <div className="add-list__header">
              <span className="add-list__title">New list</span>
              <button onClick={exitForm} className="button--icon">
                x
              </button>
            </div>
            <div className="add-list__body">
              <div className="input-list">
                <label className="input-list__label">List name</label>
                <input
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="input__field"
                  type="text"
                  placeholder="Enter list name"
                />
                {showError && (
                  <div className="errorMessage">List name cannot be empty</div>
                )}
              </div>
              <div className="color-picker">
                <label className="input-list__label">Appearance</label>
                  <ul>
                    <li onClick={()=>setListColor("#747474")} className={`${listColor === "#747474" ? "active" : ""}`}  style={{ backgroundColor: "#747474" }}></li>
                    <li onClick={()=>setListColor("#110808a3")} className={`${listColor === "#110808a3" ? "active" : ""}`}  style={{ backgroundColor: "#110808a3" }}></li>
                    <li onClick={()=>setListColor("#1359b5ab")} className={`${listColor === "#1359b5ab" ? "active" : ""}`} style={{ backgroundColor: "#1359b5ab" }}></li>
                    <li onClick={()=>setListColor("#47db36ab")} className={`${listColor === "#47db36ab" ? "active" : ""}`} style={{ backgroundColor: "#47db36ab" }}></li>
                    <li onClick={()=>setListColor("#6e327dab")} className={`${listColor === "#6e327dab" ? "active" : ""}`} style={{ backgroundColor: "#6e327dab" }}></li>
                    <li onClick={()=>setListColor("#ff000090")} className={`${listColor === "#ff000090" ? "active" : ""}`} style={{ backgroundColor: "#ff000090" }}></li>
                  </ul>
              </div>
              <SearchUsers members={members} setMembers={setMembers}/>
            </div>
            <div className="add-list__footer">
              <button onClick={submitList} className="btn">
                Create list
              </button>
            </div>
          </div>
     
      </div>
    </div>
  );
};

AddList.propTypes = {
  handleShowNewList: PropTypes.func.isRequired,
  setTriggerRefetch: PropTypes.func.isRequired,
};

export default AddList;
