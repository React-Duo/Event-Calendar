import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById, getUserDetails } from '../../service/database-service';

const SingleEvent = () => {
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
            {event && console.log(event)}
            {event && <div>
                <h1>{event.title}</h1>
                <img src={event.photo} alt="" />
                <p>Author: {author} ({event.author})</p>
                <p>Description: {event.description}</p>
                <p>Repeating: {event.repeat === "single" ? "one-time" : event.repeat.schedule}</p>
                {event.repeat.schedule === "weekly" && <p>Every: {event.repeat.weekdays.join(', ')}</p>} 
                <p>Starting at: {event.startDate} {event.startTime}</p>
                <p>Ending at: {event.endDate} {event.endTime}</p>
                <p>Location Type: {event.locationType}</p>
                <p>Location: {event.locationType === "offline" ?
                             <span>{event.location.country}, {event.location.city}, {event.location.street}</span>
                             : 
                             event.location
                             }
                </p>
                <p>Visibility: {event.visibility}</p>
                <p>Allow invited users to invite others: {event.canInvite ? "Yes": "No"}</p>
            </div>
            }
        </div>
    )
}

export default SingleEvent;