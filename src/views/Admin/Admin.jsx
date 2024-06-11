import { useEffect, useState,useContext  } from 'react';
import { editCredential, getAllEvents, getEventById, searchUser } from '../../service/database-service';
import { useNavigate} from 'react-router-dom';
import './Admin.css';
import AuthContext from "../../context/AuthContext"


const Admin = () => {
    const [userSearchParams, setUserSearchParams] = useState(null);
    const [eventSearchParams, setEventSearchParams] = useState(null);
    const [selectedTab, setSelectedTab] = useState('users');
    const [users, setUsers] = useState(null);
    const [userBlock, setUserBlock] = useState(null);
    const [foundEvents, setFoundEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {theme} = useContext(AuthContext);

    useEffect(() => {
        const handleUserSearch = async () => {
            try {
                setLoading(true);
                const data = await searchUser(userSearchParams.searchString, userSearchParams.searchTerm);
                if (!data) throw new Error("No users matched the search criteria.");
                const filteredUsers = Object.entries(data).map(([key, user]) => user = { id: key, ...user });
                setUsers(filteredUsers);
                setError(null);
            } catch (error) {
                setUsers(null);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        if (userSearchParams) handleUserSearch();
    }, [userSearchParams, userBlock]);

    useEffect(() => {
        const handleUserBlock = async () => {
            try {
                setLoading(true);
                if (userBlock.isBlocked) await editCredential(userBlock.id, "isBlocked", false);
                else await editCredential(userBlock.id, "isBlocked", true);
                setError(null);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
                setUserBlock(null);
            }
        }
        if (userBlock) handleUserBlock();
    }, [userBlock]);

    useEffect(() => {
        const handleEventSearch = async () => {
            const allEvents = await getAllEvents();
            const filteredEvents = allEvents.filter(event => event[1].title.includes(eventSearchParams));
            const eventSeries =
                await Promise.all(filteredEvents.map(async event => {
                    if (event[1].seriesId) return await getEventById(event[1].seriesId);
                    else return event[1];
                }));
            setFoundEvents(Array.from(new Map(eventSeries.map(item => [item.id, item])).values()));
        }
        if (eventSearchParams) handleEventSearch();
    }, [eventSearchParams]);

    const handleUserSearchForm = (e) => {
        e.preventDefault();
        const searchString = e.target.searchField.value;
        const searchTerm = e.target.searchType.value;
        setUserSearchParams({ searchString, searchTerm });
    }

    const handleEventSearchForm = (e) => {
        e.preventDefault();
        const searchString = e.target.eventTitle.value;
        setEventSearchParams(searchString);
    }

    if (loading) {
        return <div className="spinner"></div>
    }

    return (
        <div className={`container-content ${theme && "dark-theme-admin" }`}> 
            <div className="popup">
                <div className="tabs">
                    <div className='top-tabs'>
                        <input
                            className='popup-input'
                            type="radio"
                            id="tab1"
                            name="tab"
                            checked={selectedTab === 'users'}
                            onChange={() => setSelectedTab('users')}
                        />
                        <label htmlFor="tab1" className='labelText popup-label'>Users</label>
                        <input
                            className='popup-input'
                            type="radio"
                            id="tab2"
                            name="tab"
                            checked={selectedTab === 'events'}
                            onChange={() => setSelectedTab('events')}
                        />
                        <label htmlFor="tab2" className='labelText popup-label'>Events</label>
                    </div>
                    <div className="marker">
                        <div id="top"></div>
                        <div id="bottom"></div>

                        {selectedTab === 'users' && (
                            <>
                                <form onSubmit={handleUserSearchForm} className="search-form">
                                    <input className='input__field' type="text" id="searchField" name="searchField" placeholder="Search users..." required />
                                    <br />
                                    <span className="search-terms">
                                        <input type="radio" value="firstName" id="firstName" name="searchType" required />
                                        <label className='labelText' htmlFor="firstName">First Name</label>
                                        <input type="radio" value="lastName" id="lastName" name="searchType" required />
                                        <label className='labelText' htmlFor="lastName">Last Name</label>
                                        <input type="radio" value="emailAddress" id="emailAddress" name="searchType" required />
                                        <label className='labelText' htmlFor="emailAddress">Email Address</label>
                                        <input type="radio" value="username" id="username" name="searchType" required />
                                        <label className='labelText' htmlFor="username">Username</label>
                                    </span>
                                    <br />
                                    <button className='btn' type="submit">Search</button>
                                </form>
                                {error && <div id="error">{error}</div>}
                                {users &&
                                    <>
                                        {users.length === 0 ? <div>No users found.</div> : `${users.length} user(s) found.`}
                                        <div className="users-list">
                                            {users.map(user => {
                                                return <div className="user-details" key={user.id}>
                                                    <img src={user.photo} alt="" />
                                                    <div>
                                                        <label>Display Name: </label> {user.firstName} {user.lastName} {user.role === "admin" && "(Admin)"}
                                                        <br />
                                                        <label>Email address: </label> {user.email} <br />
                                                        <label>Username: </label> {user.username} <br />
                                                        {user.role !== "admin" &&
                                                            (user.isBlocked ?
                                                                <button className='btn' onClick={() => setUserBlock(user)}>Unblock user</button>
                                                                :
                                                                <button className='btn' onClick={() => setUserBlock(user)}>Block user</button>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            })}
                                        </div>
                                    </>
                                }
                            </>
                        )}

                        {selectedTab === 'events' && (
                            <>
                                <form onSubmit={handleEventSearchForm} className="search-form">
                                    <input className='input__field' type="text" id="eventTitle" name="eventTitle" placeholder='Search events...' required />
                                    <button className='btn' type="submit">Search</button>
                                </form>

                                {foundEvents && (
                                    <>
                                        {foundEvents.length === 0 ? <div>No events found.</div> : `${foundEvents.length} event(s) found.`}
                                        <div className="events-list">
                                            {foundEvents.map(event => {
                                                return <div className="event-details" key={event.id} onClick={() => navigate(`/event/${event.id}`)}>
                                                    <img src={event.photo} alt="" />
                                                    <br />
                                                    <label>Author: </label> {event.author}
                                                    <br />
                                                    <label>Title: </label> {event.title}
                                                </div>
                                            })}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin;