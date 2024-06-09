import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { deleteEvent, getEventById, getUserDetails, updateEvent } from '../../service/database-service';
import  AuthContext  from '../../context/AuthContext';
import Address from '../Address/Address';
import "./SingleEvent.css";
import { isAddressValid } from '../../service/utils';
import InviteUsers from '../InviteUsers/InviteUsers';

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
        const location = locationType === "offline" 
                            ? {country: e.target.country.value, city: e.target.city.value, street: e.target.street.value}
                            : (e.target.editLocation?.value || event.location);

        if (locationType === "offline") {
            if (isAddressValid(location, setError) === 'Address is invalid') return;
        }

        const visibility = e.target.editVisibility?.value || event.visibility;
        const canInvite = e.target.editCanInvite?.checked || event.canInvite;

        setEvent({...event, title, description, invited, locationType, location, visibility, canInvite});
        setUpdatedEvent({...event, title, description, invited, locationType, location, visibility, canInvite});
        setError(null);
        setEditStatus(false);
        setInviteStatus(false);
    }

    const handleLocationTypeChange = (e) => {
        e.preventDefault();
        if (e.target.value === "offline") {
            setEvent({...event, locationType: e.target.value});
        } else {
            setEvent({...event, locationType: e.target.value, location: ""});
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
        <div className="single-event-info">
            {event && 
            <form onSubmit={handleEdit} onClick={() => setSuggestions([])}>
                <h1>{editStatus ? <input type="text" id="editTitle" name="editTitle" defaultValue={event.title} /> : event.title }</h1>

                <img src={event.photo} alt="" />

                <p>
                    <span>Author:</span> {author} ({event.author})
                </p>

                <p>
                    <span>Description:</span> 
                    {editStatus ? <input type="text" id="editDescription" name="editDescription" defaultValue={event.description} /> 
                                : event.description
                    }
                </p>

                <p>
                    <span>Repeating:</span> {event.repeat === "single" ? "one-time" : event.repeat.schedule}
                </p>
                {event.repeat.schedule === "weekly" 
                    && <p>
                            <span>Every:</span> {event.repeat.weekdays.join(', ')}
                        </p>
                } 

                <p>
                    <span>Starting at:</span> {event.startDate} {event.startTime}
                </p>

                <p>
                    <span>Ending at:</span> {event.endDate} {event.endTime}
                </p>

                <p>
                    <span>Location Type:</span> 
                    {editStatus ? 
                        <select name="editLocationType" id="editLocationType" onChange={handleLocationTypeChange} defaultValue={event.locationType}>
                            <option value="offline">Offline</option>
                            <option value="online">Online</option>
                        </select>
                        : 
                        event.locationType
                    }
                </p>

                <p>
                    <span>Location:</span>
                    {editStatus ? 
                        (event.locationType === "offline" 
                            ? 
                            <Address from={"singleEvent"} /> 
                            : 
                            <input type="text" id="editLocation" name="editLocation" defaultValue={event.location} required />)
                        :
                        (event.locationType === "offline" ?
                             <span>{event.location.country}, {event.location.city}, {event.location.street}</span>
                             : 
                             event.location
                        )
                    }
                </p>

                <p>
                    <span>Visibility:</span> 
                    {editStatus ?
                        <select name="editVisibility" id="editVisibility" defaultValue={event.visibility}>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    :
                    event.visibility
                    }
                </p>
        
                <InviteUsers editStatus={editStatus} inviteStatus={inviteStatus}
                            suggestions={suggestions} setSuggestions={setSuggestions} 
                            invitedUsers={invitedUsers} setInvitedUsers={setInvitedUsers}
                            error={error} setError={setError} event={event} invited={event.invited} 
                />

                <p>
                    <span>Allow invited users to invite others:</span> 
                    {editStatus ?
                        <input type="checkbox" id="editCanInvite" name="editCanInvite" defaultChecked={event.canInvite} />
                        : 
                        (event.canInvite ? "Yes": "No")
                    }
                </p>

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
                    <span className="edit-buttons">
                        {inviteStatus && <button type="submit" className="form-button">Save</button>}
                        {!inviteStatus && <button onClick={() => setInviteStatus(true)} className="form-button">Invite</button>}
                    </span>
                }

                {error && <p className="error-message">{error}</p>}
            </form>
            }
        </div>
    )
}

export default SingleEvent;