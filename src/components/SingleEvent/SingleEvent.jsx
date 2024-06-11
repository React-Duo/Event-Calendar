import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { deleteEvent, getEventById, getUserDetails, updateEvent } from '../../service/database-service';
import AuthContext from '../../context/AuthContext';
import Address from '../Address/Address';
import "./SingleEvent.css";
import { isAddressValid } from '../../service/utils';
import InviteUsers from '../InviteUsers/InviteUsers';
import Weather from '../Weather/Weather';
import GoogleMaps from '../GoogleMaps/GoogleMaps';
import dayjs from 'dayjs';
import { getImageURL, uploadEventImage } from '../../service/storage';

const SingleEvent = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [author, setAuthor] = useState(null);
    const [editStatus, setEditStatus] = useState(false);
    const [inviteStatus, setInviteStatus] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updatedEvent, setUpdatedEvent] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [photo, setPhoto] = useState(null);
    const {theme} = useContext(AuthContext);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const event = await getEventById(id);
                if (event.seriesId) {
                    const seriesEvent = await getEventById(event.seriesId);
                    setEvent(seriesEvent);
                } else setEvent(event);
            } catch (error) {
                console.log(error.message);
            }
        }
        if (id) fetchEvent();
    }, [id]);

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const userAsArray = await getUserDetails(event.author);
                setAuthor(`${userAsArray[0].firstName} ${userAsArray[0].lastName}`);
            } catch (error) {
                console.log(error.message);
            }
        }
        if (event) fetchAuthor();
    }, [event]);

    useEffect(() => {
        if (updatedEvent) {
            try {
                updateEvent(updatedEvent);
            } catch (error) {
                console.log(error.message);
            }
        }
    }, [updatedEvent]);

    const handleEdit = (e) => {
        e.preventDefault();
        const title = e.target.editTitle?.value || event.title;
        const description = e.target.editDescription?.value || event.description;
        const invited = invitedUsers.map(user => user.email);
        const locationType = e.target.editLocationType?.value || event.locationType;
        const location = locationType === "offline" ?
            (isLoggedIn.user === event.author ?
                { country: e.target.country.value, city: e.target.city.value, street: e.target.street.value }
                :
                { country: event.location.country, city: event.location.city, street: event.location.street }
            )
            : (e.target.editLocation?.value || event.location);

        if (locationType === "offline") {
            if (isAddressValid(location, setError) === 'Address is invalid') return;
        }

        const visibility = e.target.editVisibility?.value || event.visibility;
        const canInvite = (isLoggedIn.user !== event.author) ? event.canInvite : e.target.editCanInvite?.checked;
        
        setEvent({ ...event, title, description, invited, locationType, location, visibility, canInvite });
        setUpdatedEvent({ ...event, title, description, invited, locationType, location, visibility, canInvite });
        setError(null);
        setEditStatus(false);
        setInviteStatus(false);
    }

    useEffect(() => {
        const uploadPhoto = async () => {
            try {
                await uploadEventImage(event.id, photo);
                const photoURL = await getImageURL(event.id);
                setEvent({ ...event, photo: photoURL });
            } catch (error) {
                console.log(error.message);
            }
        }   
        if (photo) uploadPhoto();
    }, [photo]);

    const handleLocationTypeChange = (e) => {
        e.preventDefault();
        if (e.target.value === "offline") {
            setEvent({ ...event, locationType: e.target.value });
        } else {
            setEvent({ ...event, locationType: e.target.value, location: "" });
        }
    }

    const handleDelete = async (flag) => {
        setEditStatus(false);
        if (flag === "single") {
            await deleteEvent(id, flag);
        }

        if (flag === "series") {
            await deleteEvent(event.id, flag);
        }
    }

    if (loading) {
        return (
            <div className='spinner'></div>
        )
    }

    return (
        <div className={`single-event-info ${theme && "dark-single-event"}`}>

            {event &&
                <form onSubmit={handleEdit} onClick={() => setSuggestions([])}>
                    <img id='single-event-header-img' src={event.photo} alt="event photo" />
                    <br />
                    <hr />

                    {editStatus && 
                        <>
                            <label htmlFor="uploadForm"> Upload Image </label>
                            <input type="file" name="uploadForm" id="uploadForm" className="formbold-form-file" onChange={e => setPhoto(e.target.files[0])} />
                        </>
                    }

                    <div className='single-event-header'>
                        <div className='hours-single-event'>
                            <p>From:  {dayjs(event.startDate).format("MMMM D(dddd), YYYY")} AT <span className='event-hours-time'>{event.startTime}hr</span></p>
                            <p>To: {dayjs(event.endDate).format("MMMM D(dddd), YYYY")} AT <span className='event-hours-time'>{event.endTime}hr</span></p>
                        </div>
                        <h1>{editStatus ? <input type="text" id="editTitle" name="editTitle" defaultValue={event.title} /> : event.title}</h1>
                    </div>
                    <hr />
                    <div className='single-event-view-details-container'>
                        <div className='single-event-view-details'>
                            <h3>Details</h3>
                            <p>
                                <i className="fa-solid fa-user fa-lg"></i>   <span>Event by:</span> {author} ({event.author})
                            </p>

                            <p>
                                <i className="fa-solid fa-align-left fa-lg"></i>
                                <span>Description:</span>
                                {editStatus ? <input type="text" id="editDescription" name="editDescription" defaultValue={event.description} />
                                    : event.description
                                }
                            </p>
                            <p>
                                <i className="fa-solid fa-rotate-right fa-lg"></i>
                                <span>Repeating:</span> {event.repeat === "single" ? "one-time" : event.repeat.schedule}
                                {event.repeat.schedule === "weekly"
                                    && <p>
                                        <span>Every:</span> {event.repeat.weekdays.join(', ')}
                                    </p>
                                }
                            </p>
                            <p>
                                <span><i className="fa-solid fa-location-dot fa-lg"></i>Location:</span>
                                {editStatus ?
                                    (event.locationType === "offline" ?
                                        <Address />
                                        :
                                        <input type="text" id="editLocation" name="editLocation" defaultValue={event.location} required />
                                    )
                                    :
                                    (event.locationType === "offline" ?
                                        <span>{event.location.country}, {event.location.city}, {event.location.street}</span>
                                        :
                                        <span>{event.location}</span>
                                    )
                                }
                            </p>
                            <p>
                                <span><i className="fa-solid fa-map-location-dot fa-lg"></i>Location Type:</span>
                                {editStatus ?
                                    <select name="editLocationType" id="editLocationType" onChange={handleLocationTypeChange} defaultValue={event.locationType}>
                                        <option value="offline">Offline</option>
                                        <option value="online">Online</option>
                                    </select>
                                    :
                                    <span>{event.locationType}</span>
                                }
                            </p>
                            <p>
                                <span>{event.visibility === "public" ? <i className="fa-solid fa-earth-americas fa-lg"></i> : <i className="fa-solid fa-lock fa-lg"></i>}Visibility:</span>
                                {editStatus ?
                                    <select name="editVisibility" id="editVisibility" defaultValue={event.visibility}>
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                    : <span>{event.visibility}</span>
                                }
                            </p>
                            <p>
                                <span><i className="fa-solid fa-wrench fa-lg"></i>Allow invited users to invite others:</span>
                                {editStatus ?
                                    <input type="checkbox" id="editCanInvite" name="editCanInvite" defaultChecked={event.canInvite} />
                                    :
                                    (event.canInvite ? "Yes" : "No")
                                }
                            </p>
                        </div>
                        <div>
                            <InviteUsers editStatus={editStatus} inviteStatus={inviteStatus}
                                suggestions={suggestions} setSuggestions={setSuggestions}
                                invitedUsers={invitedUsers} setInvitedUsers={setInvitedUsers}
                                error={error} setError={setError} event={event} invited={event.invited}
                            />
                        </div>
                    </div>
                    {isLoggedIn.user === event.author &&
                        <span className="edit-buttons">
                            {!editStatus && <button onClick={() => setEditStatus(true)} className="form-button">Edit</button>}
                            {editStatus &&
                                (event.repeat !== "single" ?
                                    <span>
                                        <button onClick={() => handleDelete("series")} className="form-button delete-button">Delete series</button>
                                        <button onClick={() => handleDelete("single")} className="form-button delete-button">Delete event</button>
                                    </span>
                                    :
                                    <button onClick={() => handleDelete("single")} className="form-button delete-button">Delete event</button>
                                )
                            }
                            {editStatus && <button type="submit" className="form-button">Save</button>}
                        </span>
                    }
                    {isLoggedIn.user !== event.author &&
                        (event.canInvite &&
                            <span className="edit-buttons">
                                {inviteStatus && <button type="submit" className="form-button">Save</button>}
                                {!inviteStatus && <button onClick={() => setInviteStatus(true)} className="form-button">Invite</button>}
                            </span>
                        )
                    }
                    <hr />
                    <div className='weather_location'>
                        <div>
                            {event.locationType === "offline" && <h3>Weather</h3>}
                            {event.locationType === "offline" && <Weather city={event.location.city} />}
                        </div>
                        <div>
                            {event.locationType === "offline" && <h3>Location</h3>}
                            {event.locationType === "offline" && <GoogleMaps city={event.location.city} street={event.location.street} />}

                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                </form>
            }
        </div>
    )
}

export default SingleEvent;