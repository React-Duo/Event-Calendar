import './Weekdays.css';

const Weekdays = () => {

    const handleWeekdayChange = (e) => {
        console.log(e.target.value);
    }

    return (
        <>
            <div className="weekDays-selector">
                <input type="checkbox" id="weekday-mon" value="Monday" className="weekday" onChange={handleWeekdayChange}/>
                <label htmlFor="weekday-mon">M</label>
                <input type="checkbox" id="weekday-tue" value="Tuesday" className="weekday" onChange={handleWeekdayChange}/>
                <label htmlFor="weekday-tue">T</label>
                <input type="checkbox" id="weekday-wed" value="Wednesday" className="weekday" onChange={handleWeekdayChange}/>
                <label htmlFor="weekday-wed">W</label>
                <input type="checkbox" id="weekday-thu" value="Thursday" className="weekday" onChange={handleWeekdayChange}/>
                <label htmlFor="weekday-thu">T</label>
                <input type="checkbox" id="weekday-fri" value="Friday" className="weekday" onChange={handleWeekdayChange}/>
                <label htmlFor="weekday-fri">F</label>
                <input type="checkbox" id="weekday-sat" value="Saturday" className="weekday" onChange={handleWeekdayChange}/>
                <label htmlFor="weekday-sat">S</label>
                <input type="checkbox" id="weekday-sun" value="Sunday" className="weekday" onChange={handleWeekdayChange}/>
                <label htmlFor="weekday-sun">S</label>
            </div>
            <label htmlFor="weekDays-selector"> Select day </label>
        </>
    )
}

export default Weekdays;