import React from 'react'
import Day from "./Day"
import { getAllEvents } from '../../service/database-service'
import { useState, useEffect, useContext } from 'react'
import AuthContext from "../../context/AuthContext";
import PropTypes from 'prop-types';
import GlobalContext from "./calendarContext/GlobalContext";


const Month = ({ month}) => {
    const [allEvents, setAllEvents] = useState([]);
    const { isLoggedIn } = useContext(AuthContext);
    const { view } = useContext(GlobalContext);


    useEffect(() => {
        if(view === "month"){
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
        }
        
    }, [isLoggedIn.user, view]);

    if (view === "month") {
        return (
            <div className="container-month">
                {month.map((row, i) => (
                    <React.Fragment key={i}>
                        {row.map((day, idx) => {
                            return <Day events={allEvents} day={day} key={idx} rowIdx={i} />
                        })}
                    </React.Fragment>
                ))}
            </div>
        )
    } else {
        return (
            <div className="container-week">
                {month.map((day, i) => (
                    <Day events={allEvents} day={day} key={i} rowIdx={i} />
                ))}
            </div>
        )
    }
}


Month.propTypes = {
    month: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]).isRequired,
}

export default Month;