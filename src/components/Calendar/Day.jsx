import { useState, useEffect, useContext } from 'react'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';
import PropTypes from 'prop-types';
import GlobalContext from "./calendarContext/GlobalContext";



const Day = ({ events, day, rowIdx }) => {
    const [dayEvents, setDayEvents] = useState([])
    dayjs.extend(isBetween)
    const { view } = useContext(GlobalContext);

    useEffect(() => {
        if (view === "month") {
            const dayEvents = events.filter(event => {
                return dayjs(day.format("MM-DD-YYYY")).isBetween(event[1].startDate, event[1].endDate, "day", '[]')
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
                                <div className="single-event-title" key={index}>{event[1].title}</div>
                            ))
                        )}
                    </div>
                )}

            </div>
        )
    } else {
        return (
            <div className='days'>
                <header>
                    <p>{day[0].format('ddd').toUpperCase()}</p>
                </header>
                {day.map((hour, i) => (
                    <div key={i}>
                        {hour.format("dddd") === "Monday" ? <div className='hour-container'><p>{hour.format("HH:mm")}</p></div> : <div className='hour-container'></div>}
                    </div>
                ))}
            </div>
        )
    }
}

Day.propTypes = {
    events: PropTypes.array,
    day: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    rowIdx: PropTypes.number
}

export default Day