import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById, getUserDetails } from '../../service/database-service';
import  AuthContext  from '../../context/AuthContext';
import "./SingleEvent.css";

const SingleEvent = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [author, setAuthor] = useState(null);

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

    

    return (
        <div className="single-event-info">
            {event && <div>
                <h1>{event.title}</h1>
                <img src={event.photo} alt="" />
                <p><span>Author:</span> {author} ({event.author})</p>
                <p><span>Description:</span> {event.description}</p>
                <p><span>Repeating:</span> {event.repeat === "single" ? "one-time" : event.repeat.schedule}</p>
                {event.repeat.schedule === "weekly" && (
                    <p><span>Every:</span> {event.repeat.weekdays.join(', ')}</p>
                )} 
                <p><span>Starting at:</span> {event.startDate} {event.startTime}</p>
                <p><span>Ending at:</span> {event.endDate} {event.endTime}</p>
                <p><span>Location Type:</span> {event.locationType}</p>
                <p><span>Location:</span> 
                    {event.locationType === "offline" ?
                             <span>{event.location.country}, {event.location.city}, {event.location.street}</span>
                             : 
                             event.location
                    }
                </p>
                <p><span>Visibility:</span> {event.visibility}</p>
                <p><span>Allow invited users to invite others:</span> {event.canInvite ? "Yes": "No"}</p>
                {console.log(isLoggedIn.user)}
                <button onClick={() => {}}>Edit</button>
            </div>
            }
        </div>
    )
}

export default SingleEvent;