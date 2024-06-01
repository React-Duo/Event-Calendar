import { useState, useEffect, useContext } from 'react'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';
import PropTypes from 'prop-types';
import GlobalContext from "./calendarContext/GlobalContext";
import { getAllEvents } from '../../service/database-service'
import AuthContext from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';


const Day = ({ day, rowIdx }) => {
    const [dayEvents, setDayEvents] = useState([])
    dayjs.extend(isBetween)
    const { view } = useContext(GlobalContext);
    const [events, setAllEvents] = useState([]);
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchEvents = async () => {
            const events = await getAllEvents();
            if (events) {
                const filteredEvents = events.filter(event => event[1].author === isLoggedIn.user || event[1].invited && event[1].invited.includes(isLoggedIn.user));
                setAllEvents(filteredEvents);
            } else {
                setAllEvents([]);
            }

        };
        fetchEvents();


    }, [isLoggedIn.user, view]);
    useEffect(() => {
        if (view === "month") {
            const dayEvents = events.filter(event => {
                return dayjs(day.format("MM-DD-YYYY")).isBetween(event[1].startDate, event[1].endDate, "day", '[]')
            })
            setDayEvents(dayEvents)
        } else if (view === "week") {
            const dayEvents = events.filter(event => {
                return day.map(d => dayjs(d.format("MM-DD-YYYY")).isBetween(event[1].startDate, event[1].endDate, "day", '[]'))
            })
            setDayEvents(dayEvents)
        } else if (view === "day") {
            const dayEvents = events.filter(event => {
                return day.map(d => dayjs(d.format("MM-DD-YYYY")).isBetween(event[1].startDate, event[1].endDate, "day", '[]'))
            })
            setDayEvents(dayEvents)
        } 
        else if (view === "workWeek") {
            const dayEvents = events.filter(event => {
                return day.map(d => dayjs(d.format("MM-DD-YYYY")).isBetween(event[1].startDate, event[1].endDate, "day", '[]'))
            })
            setDayEvents(dayEvents)
        }

    }, [day, events]);

    function getCurrentDayClass() {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? "currentDay" : ""
    }

    if (view === "month") {
        return (
            <div className='days'>
                <header>
                    {rowIdx === 0 && <p>{day.format('ddd').toUpperCase()}</p>}
                    <p className={`${getCurrentDayClass()}`}>
                        {day.format('D')}
                    </p>
                </header>

                {dayEvents !== undefined && dayEvents.length > 0 && (
                    <div className="calendar-event-title">
                        {dayEvents.length === 1 ? (
                            <div className="single-event-title">{dayEvents[0][1].title}</div>
                        ) : (
                            dayEvents.map((event, index) => (
                                <div onClick={()=> navigate("/settings")} className="single-event-title" key={index}>{event[1].title}</div>
                            ))
                        )}
                    </div>
                )}

            </div>
        )
    } else if (view === "week") {
        return (
            <div className='days'>   
                <header>
                    <p>{day[0].format('DD-ddd MM').toUpperCase()}</p>
                </header>
                {day.map((hour, i) => (
                    <div key={i} >                      
                        <div className='hour-container'>
                        {dayEvents.map((event, eventIndex) => (
                            <div key={eventIndex}>
                                <div >{dayjs(hour.format("YYYY-MM-DDTHH:mm")).isBetween((dayjs(`${event[1].startDate}T${event[1].startTime}`)), dayjs(`${event[1].endDate}T${event[1].endTime}`), "hour", '[]') && <div ><p onClick={()=> navigate("/settings")} className="single-event-title">{event[1].title}</p></div>}</div>                            
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
        )
    } else if (view === "day") {
        return (
            <div className='days'>
                <header>
                    <p id='single-day-name'>{day[0].format('dddd').toUpperCase()}</p>
                </header>
                {day.map((hour, i) => (
                    <div key={i} className='hour-day-container'>
                        <div className='hour-day-container-event'>
                        {dayEvents.map((event, eventIndex) => (
                            <div key={eventIndex}>
                                <div >{dayjs(hour.format("YYYY-MM-DDTHH:mm")).isBetween((dayjs(`${event[1].startDate}T${event[1].startTime}`)), dayjs(`${event[1].endDate}T${event[1].endTime}`), "hour", '[]') && <div ><p onClick={()=> navigate("/settings")} className="single-event-title">{event[1].title}</p></div>}</div>                            
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
        )

    } else if(view === "workWeek"){
        return (
            <div className='days'>
                <header>
                    <p>{day[0].format('DD-ddd').toUpperCase()}</p>
                </header>
                {day.map((hour, i) => (
                    <div key={i} >
                        <div className='hour-container'>
                        {dayEvents.map((event, eventIndex) => (
                            <div key={eventIndex}>
                                <div >{dayjs(hour.format("YYYY-MM-DDTHH:mm")).isBetween((dayjs(`${event[1].startDate}T${event[1].startTime}`)), dayjs(`${event[1].endDate}T${event[1].endTime}`), "hour", '[]') && <div ><p onClick={()=> navigate("/settings")} className="single-event-title">{event[1].title}</p></div>}</div>                            
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

Day.propTypes = {
    day: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    rowIdx: PropTypes.number
}

export default Day