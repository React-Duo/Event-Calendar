import './Weekdays.css';

const Weekdays = (props) => {

    return (
        <>
            <label htmlFor="weekDays-selector"> On </label>
            <span className="weekDays-selector">
                <input type="checkbox" id="monday" onChange={props.handle}/>
                <label htmlFor="monday">M</label>
                <input type="checkbox" id="tuesday" onChange={props.handle}/>
                <label htmlFor="tuesday">T</label>
                <input type="checkbox" id="wednesday" onChange={props.handle}/>
                <label htmlFor="wednesday">W</label>
                <input type="checkbox" id="thursday" onChange={props.handle}/>
                <label htmlFor="thursday">T</label>
                <input type="checkbox" id="friday" onChange={props.handle}/>
                <label htmlFor="friday">F</label>
                <input type="checkbox" id="saturday" onChange={props.handle}/>
                <label htmlFor="saturday">S</label>
                <input type="checkbox" id="sunday" onChange={props.handle}/>
                <label htmlFor="sunday">S</label>
            </span>
        </>
    )
}

export default Weekdays;