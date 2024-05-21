import "./ListById.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getListById, updateList, deleteList } from "../../service/database-service";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SearchUsers from "../SearchUsers/SearchUsers";


const ListById = () => {
  const params = useParams();
  const listId = params.id;
  const { isLoggedIn } = useContext(AuthContext);
  const [list, setList] = useState({});
  const [contentIn, setContentIn] = useState("members");
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const list = await getListById(listId);
        setList(list);
      } catch (error) {
        console.error(error);
      }
    };
    fetchList();
  }, [listId]);

  const handleRemoveFromList = async (user) => {
    try {
      const updatedList = { ...list };
      updatedList.contacts = updatedList.contacts.filter(contact => contact !== user);
      await updateList(listId,updatedList);
      setList(updatedList);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToList = async (members) => {
    try {
      if(members.length === 0) {
        setShowError(true);
        return;
      }
      const updatedList = { ...list };
      const existingContacts = updatedList.contacts;
      const newContacts = members.filter(member => !existingContacts.includes(member));
      updatedList.contacts = [...existingContacts, ...newContacts];
      await updateList(listId, updatedList);
      setList(updatedList);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="list-by-id">
      <div className="list-by-is-title">
        <h1>{list.name}</h1>
        {list.owner === isLoggedIn.user?(<button onClick={async()=> {await deleteList(listId); navigate("/contacts")}} className="table-btn" id="table-btn-remove">delete list</button>):(<button onClick={()=>handleRemoveFromList(isLoggedIn.user)} className="table-btn" id="table-btn-remove">Leave</button>)}
        <div className="list-by-is-title-right">
          {list.owner === isLoggedIn.user && <i onClick={()=>{handleShowSearch(); setShowError(false)}} className="fa-solid fa-user-plus fa-xl"></i>}
          <button onClick={() => navigate("/contacts")} className="button--icon">x</button>
        </div>
      </div>
      <hr />
      <div>
        <ul>
          <li onClick={() => setContentIn("members")}>Members</li>
          <li onClick={() => setContentIn("chat")}>Chat</li>
        </ul>
      </div>
      {showSearch && <> 
      <SearchUsers members={members} setMembers={setMembers} />  
      {showError && <div className="errorMessage">List is empty</div>}
      <button onClick={()=>handleAddToList(members)} className="btn">Add members</button>
</>}
      
      <div>
        {contentIn === "members" && (
          <div >
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.contacts &&
                  list.contacts.map((contact, index) => (
                    <tr key={index}>
                      <td>
                        <img src="https://picsum.photos/50/50" alt="Contact" />
                      </td>
                      <td>koko</td>
                      <td>{contact}</td>
                      <td className="table-actions">
                        <button className="table-btn">Add to event</button>
                        {list.owner === isLoggedIn.user && (
                          <button className="table-btn" id="table-btn-remove" onClick={()=>handleRemoveFromList(contact)}>
                            Remove from list
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        {contentIn === "chat" && (
          <div>
            <p>Chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListById;
