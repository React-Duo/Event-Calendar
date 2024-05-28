import "./AllEvents.css"
import { getAllEvents, addUserToEvent } from "../../service/database-service"
import { useEffect, useState, useContext } from "react"
import AuthContext from "../../context/AuthContext";



const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState("");
    const [eventsToShow, setEventsToShow] = useState([]);
    const { isLoggedIn } = useContext(AuthContext);
    const [showedEvents, setShowedEvents] = useState("All events");


    useEffect(() => {
        const fetchEvents = async () => {

            const events = await getAllEvents();
            const publicEvents = events.filter(event => event[1].visibility === "public");
            setEvents(publicEvents);
            setEventsToShow(publicEvents);
        };
        fetchEvents();

       
    }, []);

    const fetchAddUserToEvent = async (eventId) => {
        await addUserToEvent(eventId, isLoggedIn.user);
        const events = await getAllEvents();
        const publicEvents = events.filter(event => event[1].visibility === "public");
        setEvents(publicEvents);
        setEventsToShow(publicEvents);
        setFilter("joined")
    };

   useEffect(() => {
    const filterEvents = (filter) => {
        if (filter === "top") {
            const topEvents = events.sort((a, b) => b[1].invited.length - a[1].invited.length);
            setEventsToShow([...topEvents]);
            setShowedEvents("Top events")
        }
        if (filter === "today") {
            const todayEvents = events.filter(event => event[1].startDate === new Date().toISOString().split('T')[0]);
            setEventsToShow([...todayEvents]);
            setShowedEvents("Today events")
        }

        if (filter === "joined") {
            const joinedEvents = events.filter(event => event[1].invited.includes(isLoggedIn.user));
            setEventsToShow([...joinedEvents]);
            setShowedEvents("Joined events")
        }
    }
    filterEvents(filter);
   }, [filter])

    return (
        <div className="all-events-container">
            <div>
                <h2>Discover events</h2>
                <h3>{showedEvents}</h3>
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
                                <h3>{event[1].title}</h3>
                                <div className="hours-event">
                                    <p>From: <span >{`${event[1].startDate}th ${event[1].startTime}`}</span></p>
                                    <p>To:<span>{`  ${event[1].endDate}th ${event[1].endTime}`}</span></p>
                                </div>
                                <p>{event[1].location}</p>
                                <div className="people-going">
                                    {event[1].invited && event[1].invited.filter(person => person !== isLoggedIn.user).slice(0, 2).map((person, index) => (
                                        <div className="one-person" key={index}>
                                            <p>{`${person} is going  `}</p>
                                        </div>
                                    ))}
                                    {event[1].invited && event[1].invited.length > 2 && (
                                        <div className="one-person">
                                            <p>{`  and ${event[1].invited.length - 2} more..`}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="single-event-options">
                                    <button className="btn" disabled>More info</button>
                                    {event[1].invited.includes(isLoggedIn.user) ? <button className="btn" style={{ color: "green" }} disabled>Joined</button> : <button className="btn"  onClick={() => fetchAddUserToEvent(event[0])}>Join</button>}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p id="no-events-text">No events</p>
                )}
            </div>
        </div>
    )
}

export default AllEvents