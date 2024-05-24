import "./AllEvents.css"
import { getAllEvents } from "../../service/database-service"
import { useEffect, useState, useContext } from "react"
import AuthContext from "../../context/AuthContext";



const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState("");
    const [eventsToShow, setEventsToShow] = useState([]);
    const { isLoggedIn } = useContext(AuthContext);


    useEffect(() => {
        const fetchEvents = async () => {

            const events = await getAllEvents();
            const publicEvents = events.filter(event => event.visibility === "public");
            setEvents(publicEvents);
            setEventsToShow(publicEvents);
        };
        fetchEvents();

       
    }, []);

   useEffect(() => {
    const filterEvents = (filter) => {
        if (filter === "top") {
            const topEvents = events.sort((a, b) => b.invited.length - a.invited.length);
            setEventsToShow([...topEvents]);
        }
        if (filter === "today") {
            const todayEvents = events.filter(event => event.startDate === new Date().toISOString().split('T')[0]);
            setEventsToShow([...todayEvents]);
        }

        if (filter === "joined") {
            const joinedEvents = events.filter(event => event.invited.includes(isLoggedIn.user));
            setEventsToShow([...joinedEvents]);
        }
    }
    filterEvents(filter);
   }, [filter])

    return (
        <div className="all-events-container">
            <div>
                <h2>Discover events</h2>
            </div>
            <div className="events-filter">
                <p><i className="fa-solid fa-location-dot"></i>My location</p>
                <p onClick={() => setFilter("top")}>Top</p>
                <p onClick={()=> setFilter("today")}>Today</p>
                <p onClick={()=> setFilter("joined")}>Joined</p>
            </div>
            <div className="all-events">
                {eventsToShow && eventsToShow.length !== 0 ? (
                    eventsToShow.map((event, index) => (
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
                        </div>
                    ))
                ) : (
                    <p>No events</p>
                )}
            </div>
        </div>
    )
}

export default AllEvents