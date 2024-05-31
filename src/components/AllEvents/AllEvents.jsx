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

    const fetchAndSetEvents = async () => {
        const events = await getAllEvents();
        if (events) {
            const publicEvents = events.filter(event => event[1].visibility === "public");
            const uniqueSeriesEvents = publicEvents.reduce((acc, current) => {
                const x = acc.find(item => item[1].seriesId === current[1].seriesId);
                if (!x || !current[1].seriesId) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);
            setEvents(uniqueSeriesEvents);
            setEventsToShow(uniqueSeriesEvents);
        }
    };

    useEffect(() => {
        fetchAndSetEvents();
    }, []);

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
    }, [filter, events, isLoggedIn.user]);

    const fetchAddUserToEvent = async (eventId, seriesId) => {
        let events = await getAllEvents();
        if (seriesId) {
            const seriesEvents = events.filter(event => event[1].seriesId === seriesId);
            await Promise.all(seriesEvents.map(event => addUserToEvent(event[0], isLoggedIn.user)));
        } else {
            await addUserToEvent(eventId, isLoggedIn.user);
        }
        fetchAndSetEvents();
    };


    return (
        <div className="all-events-container">
            <div>
                <h2>Discover events</h2>
                <h3>{showedEvents}</h3>
            </div>
            <div className="events-filter">
                <p><i className="fa-solid fa-location-dot"></i>My location</p>
                <p onClick={() => setFilter("top")}>Top</p>
                <p onClick={() => setFilter("today")}>Today</p>
                <p onClick={() => setFilter("joined")}>Joined</p>
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
                                <div>
                                    <p>Repeating: {event[1].repeat.schedule ? (event[1].repeat.schedule === "weekly" ? event[1].repeat.weekdays + "" : event[1].repeat.schedule) : event[1].repeat}</p>                                </div>
                                <p>
                                    {typeof event[1].location === 'string'
                                        ? event[1].location
                                        : `${event[1].location.city}, ${event[1].location.country}, ${event[1].location.street}`}
                                </p>
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
                                    {event[1].invited.includes(isLoggedIn.user) ? <button className="btn" style={{ color: "green" }} disabled>Joined</button> : <button className="btn" onClick={() => fetchAddUserToEvent(event[0], event[1].seriesId)}>Join</button>}
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