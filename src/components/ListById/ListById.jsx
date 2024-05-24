import "./ListById.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getListById, updateList, deleteList, getUserDetails, getEventByEmail, addUserToEvent } from "../../service/database-service";
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
  const [contactsDetails, setContactsDetails] = useState({});
  const [authorEvents, setAuthorEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [userToAdd, setUserToAdd] = useState("")

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleShowEvents = () => {
    setShowEvents(!showEvents);
  }

  const handleAddUserToEvent = async (eventId, user) => {
    console.log(user);
    try {
      await addUserToEvent(eventId, user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const list = await getListById(listId);
        const listWithDetails = { ...list };
        listWithDetails.contacts = list.contacts ? await Promise.all(list.contacts.map(async (contact) => await getUserDetails(contact))) : [];
        setList(list);
        setContactsDetails(listWithDetails.contacts);
        const events = await getEventByEmail(isLoggedIn.user);
        setAuthorEvents(events);
      } catch (error) {
        console.error(error);
      }
    };
    fetchList();
  }, [listId, isLoggedIn.user]);

  const handleRemoveFromList = async (user) => {
    try {
      const updatedList = { ...list };
      updatedList.contacts = updatedList.contacts.filter(contact => contact !== user);
      let updatedContacts = [...contactsDetails];
      updatedContacts = updatedContacts.filter(contact => contact[0].email !== user);
      await updateList(listId, updatedList);
      setList(updatedList);
      setContactsDetails(updatedContacts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToList = async (members) => {
    try {
      if (members.length === 0) {
        setShowError(true);
        return;
      }
      const updatedList = { ...list };
      const existingContacts = updatedList.contacts || [];
      let updatedContacts = [...contactsDetails];
      const newContacts = members.filter(member => !existingContacts.includes(member));
      const newContactsDetails = await Promise.all(newContacts.map(async (contact) => await getUserDetails(contact)));
      updatedList.contacts = [...existingContacts, ...newContacts];
      updatedContacts = [...updatedContacts, ...newContactsDetails];
      await updateList(listId, updatedList);
      setList(updatedList);
      setContactsDetails(updatedContacts);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="list-by-id">
      <div className="list-by-is-title">
        <h1>{list.name}</h1>
        {list.owner === isLoggedIn.user ? (<button onClick={async () => { await deleteList(listId); navigate("/contacts") }} className="table-btn" id="table-btn-remove">delete list</button>) : (<button onClick={() => handleRemoveFromList(isLoggedIn.user)} className="table-btn" id="table-btn-remove">Leave</button>)}
        <div className="list-by-is-title-right">
          {list.owner === isLoggedIn.user && <i onClick={() => { handleShowSearch(); setShowError(false); setMembers([]) }} className="fa-solid fa-user-plus fa-xl"></i>}
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
        <button onClick={() => handleAddToList(members)} className="btn">Add members</button>
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
                  contactsDetails.map((contact, index) => (
                    <tr key={index}>
                      <td>
                        <img src={contact[0].photo} alt="Contact" />
                      </td>
                      <td>{contact[0].username}</td>
                      <td>{contact[0].email}</td>
                      <td className="table-actions">
                        <button onClick={() => {
                          handleShowEvents()
                          setUserToAdd(contact[0].email)
                        }} className="table-btn">Add to event</button>
                        {list.owner === isLoggedIn.user && (
                          <button className="table-btn" id="table-btn-remove" onClick={() => handleRemoveFromList(contact[0].email)}>
                            Remove from list
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                {showEvents && <div className="userEvents">
                  <div className="add-list__header">
                    <h3 >Chose event</h3>
                    <button onClick={() => {
                      handleShowEvents()
                      setUserToAdd("")
                    }} className="button--icon">x </button>
                  </div>
                  {authorEvents ? authorEvents.map((event, index) => (
                    <div key={index} className="single-author-event">
                      <p>{event[1].title}</p>
                      <div className="userEvents-options">
                        <i onClick={()=> handleAddUserToEvent(event[0], userToAdd)} className="fa-solid fa-user-plus"></i>
                      </div>
                    </div>
                  )) : "No events"}
                </div>}
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
