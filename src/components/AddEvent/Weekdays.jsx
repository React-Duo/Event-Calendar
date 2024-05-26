import './Weekdays.css';

const Weekdays = (props) => {

    return (
        <>
            <label htmlFor="weekDays-selector"> Days: </label>
            <span className="weekDays-selector">
                <input type="checkbox" id="monday" onChange={props.handle}/>
                <label htmlFor="monday">Mon</label>
                <input type="checkbox" id="tuesday" onChange={props.handle}/>
                <label htmlFor="tuesday">Tue</label>
                <input type="checkbox" id="wednesday" onChange={props.handle}/>
                <label htmlFor="wednesday">Wed</label>
                <input type="checkbox" id="thursday" onChange={props.handle}/>
                <label htmlFor="thursday">Thu</label>
                <input type="checkbox" id="friday" onChange={props.handle}/>
                <label htmlFor="friday">Fri</label>
                <input type="checkbox" id="saturday" onChange={props.handle}/>
                <label htmlFor="saturday">Sat</label>
                <input type="checkbox" id="sunday" onChange={props.handle}/>
                <label htmlFor="sunday">Sun</label>
            </span>
        </>
    )
}

export default Weekdays;