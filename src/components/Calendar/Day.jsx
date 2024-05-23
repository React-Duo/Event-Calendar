import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

const Day = ({ day, rowIdx }) => {
    const [dayEvents, setDayEvents] = useState([])

    useEffect(() => {

    }, [])

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
            <div className="calendar-event-title">
                Test Event
            </div>
        </div>
    )
}

export default Day