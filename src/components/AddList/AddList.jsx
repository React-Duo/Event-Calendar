import "./AddList.css";
import PropTypes from "prop-types";
import { addList } from "../../service/database-service.js";
import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import SearchUsers from "../SearchUsers/SearchUsers";

const AddList = ({ showNewList, handleShowNewList, setTriggerRefetch }) => {
  const [listName, setListName] = useState("");
  const [showError, setShowError] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const [members, setMembers] = useState([]);


  const submitList = async () => {
    const newList = {
      name: listName,
      contacts: members,
      owner: isLoggedIn.user,
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
  };

  return (
    <div>
      <div className="container-list-form">
        {showNewList ? (
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
              
              <SearchUsers members={members} setMembers={setMembers}/>
            </div>
            <div className="add-list__footer">
              <button onClick={submitList} className="btn">
                Create list
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

AddList.propTypes = {
  showNewList: PropTypes.bool.isRequired,
  handleShowNewList: PropTypes.func.isRequired,
  setTriggerRefetch: PropTypes.func.isRequired,
};

export default AddList;
