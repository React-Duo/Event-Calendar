import './Weekdays.css';

const Weekdays = (props) => {

    return (
        <>
            <label htmlFor="weekDays-selector"> On </label>
            <span className="weekDays-selector">
                <input type="checkbox" id="weekday-mon" value="Monday" className="weekday" onChange={props.handle}/>
                <label htmlFor="weekday-mon">M</label>
                <input type="checkbox" id="weekday-tue" value="Tuesday" className="weekday" onChange={props.handle}/>
                <label htmlFor="weekday-tue">T</label>
                <input type="checkbox" id="weekday-wed" value="Wednesday" className="weekday" onChange={props.handle}/>
                <label htmlFor="weekday-wed">W</label>
                <input type="checkbox" id="weekday-thu" value="Thursday" className="weekday" onChange={props.handle}/>
                <label htmlFor="weekday-thu">T</label>
                <input type="checkbox" id="weekday-fri" value="Friday" className="weekday" onChange={props.handle}/>
                <label htmlFor="weekday-fri">F</label>
                <input type="checkbox" id="weekday-sat" value="Saturday" className="weekday" onChange={props.handle}/>
                <label htmlFor="weekday-sat">S</label>
                <input type="checkbox" id="weekday-sun" value="Sunday" className="weekday" onChange={props.handle}/>
                <label htmlFor="weekday-sun">S</label>
            </span>
        </>
    )
}

export default Weekdays;