import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';
import PropTypes from 'prop-types';


const Day = ({events, day, rowIdx }) => {
    const [dayEvents, setDayEvents] = useState([])
    dayjs.extend(isBetween)

    useEffect(() => {
        const dayEvents = events.filter(event => {
                return dayjs(day.format("MM-DD-YYYY")).isBetween(event.startDate, event.endDate, "day", '[]')
        })
        setDayEvents(dayEvents)
    }, [day, events]);

    function getCurrentDayClass() {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? "currentDay" : ""
    }

    return (
        <div className='days'>
            <header>
                {rowIdx === 0 &&  <p>{day.format('ddd').toUpperCase()}</p>}
                <p className={`${getCurrentDayClass()}`}>
                    {day.format('D')}
                </p>
            </header>
          
            {dayEvents !== undefined && dayEvents.length > 0 && (
                <div className="calendar-event-title">
                    {dayEvents.length === 1 ? (
                        <div>{dayEvents[0].title}</div>
                    ) : (
                        dayEvents.map((event, index) => (
                            <div key={index}>{event.title}</div>
                        ))
                    )}
                </div>
            )}
           
        </div>
    )
}

Day.propTypes = {
    events: PropTypes.array,
    day: PropTypes.object,
    rowIdx: PropTypes.number
}

export default Day