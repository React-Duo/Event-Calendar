import "./ListById.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getListById, updateList, deleteList, getAllEvents, getUserDetails, getEventByEmail, addUserToEvent } from "../../service/database-service";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SearchUsers from "../SearchUsers/SearchUsers";
import Chat from "../Chat/Chat";



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
  const [preferencesMessage, setPreferencesMessage] = useState(false)


  const handleShowSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleShowEvents = () => {
    setShowEvents(!showEvents);
  }

  const handleAddUserToEvent = async (eventId, user, seriesId) => {
    try {
      const userDetails = await getUserDetails(user);
      if (userDetails[0].invitePreference !== "true") {
        const events = await getAllEvents();
        if (seriesId) {
          const seriesEvents = events.filter(event => event[1].seriesId === seriesId || seriesId === event[0]);
          await Promise.all(seriesEvents.map(event => addUserToEvent(event[0], user)));
        } else {
          await addUserToEvent(eventId, user);
        }
        fetchAuthorEvents();
        setPreferencesMessage(false)
      }
      else {
        setPreferencesMessage(true)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAuthorEvents = async () => {
    const events = await getEventByEmail(isLoggedIn.user);
    if (events) {
      let uniqueSeries = events.filter(event => event[1].repeat === "single" || event[1].seriesId);
      const uniqueSeriesEvents = uniqueSeries.reduce((acc, current) => {
        const event = acc.find(item => item[1].seriesId === current[1].seriesId);
        if (!event || !current[1].seriesId) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setAuthorEvents(uniqueSeriesEvents);
    }

  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const list = await getListById(listId);
        const listWithDetails = { ...list };
        listWithDetails.contacts = list.contacts
          ? await Promise.all(
            list.contacts
              .filter(contact => contact !== isLoggedIn.user)
              .map(async (contact) => await getUserDetails(contact))
          )
          : []; if (list.owner !== isLoggedIn.user) {
            const userDetails = await getUserDetails(list.owner);
            listWithDetails.contacts.unshift(userDetails);
          }
        setList(list);
        setContactsDetails(listWithDetails.contacts);
        await fetchAuthorEvents();
      } catch (error) {
        console.error(error);
      }
    };
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  <th className="table-email">Email</th>
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
                      <td>
                        {contact[0].username}
                        {contact[0].email === list.owner && <i className="fa-solid fa-user-tie fa-lg"></i>}
                      </td>
                      <td className="table-email">{contact[0].email}</td>
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
              </tbody>
            </table>
            {showEvents && <div className="userEvents">
              <div className="add-list__header">
                <h3>Chose event</h3>
                <button onClick={() => {
                  handleShowEvents()
                  setUserToAdd("")
                  setPreferencesMessage(false)
                }} className="button--icon">x </button>
              </div>
              {authorEvents.length > 0 ? authorEvents.map((event, index) => (
                <div key={index} className="single-author-event">
                  {event[1].invited.includes(userToAdd) && <i
                    className="fa-solid fa-check"
                    style={{ color: "#63E6BE" }}
                  ></i>}
                  <p>{event[1].title}</p>
                  <div className="userEvents-options">
                    <i onClick={() => handleAddUserToEvent(event[0], userToAdd, event[1].seriesId)} className="fa-solid fa-user-plus"></i>
                  </div>
                </div>
              )) : "No events"}
              {preferencesMessage &&
                <p className="errorMessage">User has set preferences to not be invited to events</p>}
            </div>}
          </div>
        )}
        {contentIn === "chat" && (
          <div>
            <Chat listId={listId} setContentIn={setContentIn}/>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListById;
