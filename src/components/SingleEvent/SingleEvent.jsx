import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById, getUserDetails } from '../../service/database-service';
import  AuthContext  from '../../context/AuthContext';
import Address from '../Address/Address';
import "./SingleEvent.css";
import { isAddressValid } from '../../service/utils';

const SingleEvent = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [author, setAuthor] = useState(null);
    const [editStatus, setEditStatus] = useState(false);
    const [error, setError] = useState(null);

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

    const handleEdit = (e) => {
        e.preventDefault();
        const title = e.target.editTitle.value || event.title;
        const description = e.target.editDescription.value || event.description;
        const locationType = e.target.editLocationType.value || event.locationType;
        const location = locationType === "offline" 
                            ? {country: e.target.country.value, city: e.target.city.value, street: e.target.street.value}
                            : e.target.editLocation.value;

        if (locationType === "offline") {
            if (isAddressValid(location, setError) === 'Address is invalid') return;
        }

        const visibility = e.target.editVisibility.value || event.visibility;
        const canInvite = e.target.editCanInvite.checked;
 
        setEvent({...event, title, description, locationType, location, visibility, canInvite});

        
        setError(null);
        setEditStatus(false);
    }

    const handleLocationTypeChange = (e) => {
        e.preventDefault();
        if (e.target.value === "offline") {
            setEvent({...event, locationType: e.target.value});
        } else {
            setEvent({...event, locationType: e.target.value, location: ""});
        }
    }

    return (
        <div className="single-event-info">
            {event && 
            <form onSubmit={handleEdit}>
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

                <p>
                    <span>Allow invited users to invite others:</span> 
                    {editStatus ?
                        <input type="checkbox" id="editCanInvite" name="editCanInvite" defaultChecked={event.canInvite} />
                        : 
                        (event.canInvite ? "Yes": "No")
                    }
                </p>

                {editStatus && <button type="submit" className="form-button">Save</button>}
                {!editStatus && <button onClick={() => setEditStatus(true)} className="form-button">Edit</button>}
                {error && <p className="error-message">{error}</p>}
            </form>
            }
        </div>
    )
}

export default SingleEvent;