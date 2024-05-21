import "./SearchUsers.css"
import { getUsers } from "../../service/database-service.js";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import PropTypes from 'prop-types';




const SearchUsers = ({setMembers, members}) => {
    const [searchInput, setSearchInput] = useState("");
const [allUsers, setAllUsers] = useState([]);
const [filteredUsers, setFilteredUsers] = useState([]);
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
                user.email.includes(searchInput) ||
                user.firstName.includes(searchInput) ||
                user.lastName.includes(searchInput)
            )
          );
        } else {
          setFilteredUsers([]);
        }
      }, [allUsers, searchInput]);
return (
    <div>
        <div className="input-list">
            <label className="input-list__label">Members</label>
            <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input__field"
                type="search"
                placeholder="Add members by name or email"
            />
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
                        <h4>{`${user.firstName} ${user.lastName}`}</h4>
                        <p>{user.email}</p>
                    </div>
                    {user.email === isLoggedIn.user ? (
                        <>
                            <p id="you">You</p>
                        </>
                    ) : (
                        <>
                            <i
                                onClick={() =>
                                    setMembers((members) => [...members, user.email])
                                }
                                className="fa-solid fa-user-plus"
                            ></i>
                            <i
                                onClick={() =>
                                    setMembers((members) =>
                                        members.filter((member) => member !== user.email)
                                    )
                                }
                                className="fa-solid fa-xmark"
                            ></i>
                        </>
                    )}
                </div>
            ))}
        </div>
    </div>
);
}

SearchUsers.propTypes = {
    setMembers: PropTypes.func.isRequired,
    members: PropTypes.array.isRequired,
  };

export default SearchUsers