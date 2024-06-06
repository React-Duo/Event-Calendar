import "./AllEvents.css"
import { getAllEvents, addUserToEvent, getUserDetails } from "../../service/database-service"
import { useEffect, useState, useContext } from "react"
import AuthContext from "../../context/AuthContext";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";



const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState("");
    const [eventsToShow, setEventsToShow] = useState([]);
    const { isLoggedIn } = useContext(AuthContext);
    const [showedEvents, setShowedEvents] = useState("All events");
    const navigate = useNavigate();
    const [numToShow, setNumToShow] = useState(6);

    const handleShowMore = () => {
        setNumToShow(numToShow + 6);
    };


    const fetchAndSetEvents = async () => {
        const events = await getAllEvents();
        if (events) {
            const publicEvents = events.filter(event => event[1].visibility === "public" && (event[1].repeat === "single" || event[1].seriesId) || event[1].invited.includes(isLoggedIn.user) && (event[1].repeat === "single" || event[1].seriesId));
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
    });

    useEffect(() => {
        const filterEvents = (filter) => {
            if (filter === "top") {
                const topEvents = events.sort((a, b) => b[1].invited.length - a[1].invited.length);
                setEventsToShow([...topEvents]);
                setShowedEvents("Top events")
            } else if (filter === "today") {
                const todayEvents = events.filter(event => event[1].startDate === new Date().toISOString().split('T')[0]);
                setEventsToShow([...todayEvents]);
                setShowedEvents("Today events")
            } else if (filter === "joined") {
                const joinedEvents = events.filter(event => event[1].invited.includes(isLoggedIn.user));
                setEventsToShow([...joinedEvents]);
                setShowedEvents("Joined events")
            }
            else if (filter === "location") {
                const userLocation = async () => {
                    const details = await getUserDetails(isLoggedIn.user);
                    const locationEvents = events.filter(event => {
                        if (event[1].locationType !== "online") {
                            return event[1].location.city === details[0].address.city;
                        }
                    });
                    setEventsToShow([...locationEvents]);
                    setShowedEvents(`Events in ${details[0].address.city}`)
                }
                userLocation();
            }
            else if (filter === "online") {
                const onlineEvents = events.filter(event => event[1].locationType === "online");
                setEventsToShow([...onlineEvents]);
                setShowedEvents("Online events")
            }
        }
        filterEvents(filter);
    }, [filter, events, isLoggedIn.user]);

    const fetchAddUserToEvent = async (eventId, seriesId) => {
        let events = await getAllEvents();
        if (seriesId) {
            const seriesEvents = events.filter(event => event[1].seriesId === seriesId || seriesId === event[0]);
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
                <p className={filter === "location" ? "activeFilter" : ""} onClick={() => setFilter("location")} ><i className="fa-solid fa-location-dot"></i>My location</p>
                <p className={filter === "online" ? "activeFilter" : ""} onClick={() => setFilter("online")}>Online</p>
                <p className={filter === "top" ? "activeFilter" : ""} onClick={() => setFilter("top")}>Top</p>
                <p className={filter === "today" ? "activeFilter" : ""} onClick={() => setFilter("today")}>Today</p>
                <p className={filter === "joined" ? "activeFilter" : ""} onClick={() => setFilter("joined")}>Joined</p>
            </div>
            <div className="all-events">
                {eventsToShow && eventsToShow.length !== 0 ? (
                    eventsToShow.slice(0, numToShow).map((event, index) => (
                        <div className="single-event" key={index}>
                            <div>
                                <img src={event[1].photo} alt="event cover photo" />
                            </div>
                            <div className="single-event-details">
                                <h3>{event[1].title}</h3>
                                <div className="hours-event">
                                    <div className="hours-event-left">
                                        <h4>{dayjs(event[1].startDate).format("DD")}</h4>
                                        <p>{dayjs(event[1].startDate).format("MMM")}</p>
                                    </div>
                                    <div className="hours-event-right">
                                        <p>{dayjs(event[1].startDate).format("dddd")}</p>
                                        <p>{`Start ${event[1].startTime}`}</p>
                                    </div>
                                </div>
                                <div>
                                    <p>Repeating: {event[1].repeat.schedule ? (event[1].repeat.schedule === "weekly" ? event[1].repeat.weekdays + "" : event[1].repeat.schedule) : event[1].repeat}</p>
                                </div>
                                <p id="single-event-location">
                                    <i className="fa-solid fa-location-dot fa-lg"></i>
                                    {typeof event[1].location === 'string'
                                        ? event[1].location
                                        : `${event[1].location.street}, ${event[1].location.city}`}
                                </p>
                                <div className="people-going">
                                    {event[1].invited && event[1].invited.length < 2 && <p id="people-going-length">{event[1].invited.length} going</p>}
                                    {event[1].invited && event[1].invited.filter(person => person !== isLoggedIn.user).slice(0, 2).map((person, index) => (
                                        <div className="one-person" key={index}>
                                            <p>{`${person} joined`}</p>
                                        </div>
                                    ))}
                                    {event[1].invited && event[1].invited.length > 2 && (
                                        <div className="one-person">
                                            <p>{`  and ${event[1].invited.length - 2} more..`}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="single-event-options">
                                    <button onClick={() => navigate(`/event/${event[0]}`)} className="btn" >More info</button>
                                    {event[1].invited.includes(isLoggedIn.user) ? <button className="btn" style={{ color: "green" }} disabled>Joined</button> : <button className="btn" onClick={() => fetchAddUserToEvent(event[0], event[1].seriesId)}>Join</button>}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p id="no-events-text">No events</p>
                )}
            </div>
            {eventsToShow && eventsToShow.length > numToShow && (
                    <button className="cta" onClick={handleShowMore}>  <span className="hover-underline-animation"> Show more </span>
                        <svg
                            id="arrow-horizontal"
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="10"
                            viewBox="0 0 46 16"
                        >
                            <path
                                id="Path_10"
                                data-name="Path 10"
                                d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                                transform="translate(30)"
                            ></path>
                        </svg></button>
                )}
        </div>
    )
}

export default AllEvents