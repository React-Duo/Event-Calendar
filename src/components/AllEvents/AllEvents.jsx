import "./AllEvents.css"
import { getAllEvents} from "../../service/database-service"
import { useEffect, useState } from "react"

const AllEvents = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const events = await getAllEvents();
            const publicEvents = events.filter(event => event.visibility === "public");
            setEvents(publicEvents);
        };
        fetchEvents();
    }, []);

 
    return (
        <div className="all-events-container">
            <div>
                <h2>Discover events</h2>
            </div>
            <div className="events-filter">
                <p><i className="fa-solid fa-location-dot"></i>My location</p>
                <p>Online</p>
                <p>Top</p>
                <p>Passed</p>
            </div>
            <div className="all-events">
            {events && events.map((event, index) => (
                <div className="single-event" key={index}>
                    <div>
                        <img src="https://picsum.photos/380/200" alt="event" />
                    </div>
                    <div className="single-event-details">
                        <h3>{event.title}</h3>
                        <div className="hours-event">
                            <p>From: <span >{`${event.startDate}th ${event.startTime}`}</span></p>
                            <p>To:<span>{`  ${event.endDate}th ${event.endTime}`}</span></p>
                        </div>
                        <p>{event.location}</p>
                        <div className="people-going">
                        {event.invited && event.invited.slice(0, 2).map((person, index) => (                           
                            <div className="one-person" key={index}>
                                <p>{`${person} is going  `}</p>
                            </div>
                        ))}
                        {event.invited && event.invited.length > 2 && (
                            <div className="one-person">
                                <p>{`  and ${event.invited.length - 2} more..`}</p>
                            </div>
                        )}
                        </div>
                        <div className="single-event-options">
                            <button className="btn">More info</button>
                            <button className="btn">Join</button>
                        </div>
                    </div>
                </div>))}
                
            </div>
        </div>
    )
}

export default AllEvents