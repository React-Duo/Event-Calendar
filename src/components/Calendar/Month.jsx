import React from 'react'
import Day from "./Day"
import { getAllEvents} from '../../service/database-service'
import { useState, useEffect, useContext } from 'react'
import AuthContext from "../../context/AuthContext";
import PropTypes from 'prop-types';

const Month = ({ month }) => {
    const [allEvents, setAllEvents] = useState([]);
    const { isLoggedIn } = useContext(AuthContext);


    useEffect(() => {
        const fetchEvents = async () => {
            const events = await getAllEvents();
            if(events){
                const filteredEvents = events.filter(event =>event.author===isLoggedIn.user || event.invited && event.invited.includes(isLoggedIn.user));
                setAllEvents(filteredEvents);
            } else {
                setAllEvents([]);
            }
         
        };
        fetchEvents();  
    }, [isLoggedIn.user]);
    
    return (
        <div className="container-month">
            {month.map((row, i) =>   (
                <React.Fragment key={i}>
                    {row.map((day, idx) => {
                        return <Day events={allEvents} day={day} key={idx} rowIdx={i}/>
                    })}
                </React.Fragment>
            ))}
        </div>
    )
}

Month.propTypes = {
    month: PropTypes.array.isRequired
}

export default Month;