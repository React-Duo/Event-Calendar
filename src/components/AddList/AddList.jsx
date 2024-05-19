import "./AddList.css";
import PropTypes from "prop-types";
import { getUsers, addList } from "../../service/database-service.js";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";

const AddList = ({ showNewList, handleShowNewList, setTriggerRefetch }) => {
  const [searchInput, setSearchInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [listName, setListName] = useState("");
  const [members, setMembers] = useState([]);
  const [showError, setShowError] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let users = await getUsers();
        users = Object.values(users);
        setAllUsers(users);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchInput !== "") {
      setFilteredUsers(
        allUsers.filter(
          (user) =>
            user.email.includes(searchInput) && user.email !== isLoggedIn.user
        )
      );
    } else {
      setFilteredUsers([]);
    }
  }, [allUsers, searchInput, isLoggedIn.user]);

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
    setTriggerRefetch(prev => !prev);
    exitForm();
  };

  const exitForm = () => {
    handleShowNewList();
    setListName("");
    setSearchInput("");
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
              <div className="input-list">
                <label className="input-list__label">Members</label>
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="input__field"
                  type="search"
                  placeholder="Add members by email"
                />
              </div>
            </div>
            <div className="container-find-contact">
              {filteredUsers.map((user, index) => (
                <div className="single-contact" key={index}>
                  {members.includes(user.email) && (
                    <i
                      className="fa-solid fa-check"
                      style={{ color: "#63E6BE" }}
                    ></i>
                  )}
                  <div>
                    <img src="https://picsum.photos/40/40"></img>
                  </div>
                  <div>
                    <p>{user.email}</p>
                  </div>
                  <button
                    onClick={() =>
                      setMembers((members) => [...members, user.email])
                    }
                  >
                    Add
                  </button>
                  <button
                    onClick={() =>
                      setMembers((members) =>
                        members.filter((member) => member !== user.email)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
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
