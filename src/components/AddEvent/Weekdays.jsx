import './Weekdays.css';
import PropTypes from 'prop-types';

const Weekdays = () => {

    return (
        <>
            <label htmlFor="weekDays-selector"> Days: </label>
            <span className="weekDays-selector">
                <input type="checkbox" id="monday" />
                <label htmlFor="monday">Mon</label>
                <input type="checkbox" id="tuesday" />
                <label htmlFor="tuesday">Tue</label>
                <input type="checkbox" id="wednesday" />
                <label htmlFor="wednesday">Wed</label>
                <input type="checkbox" id="thursday" />
                <label htmlFor="thursday">Thu</label>
                <input type="checkbox" id="friday" />
                <label htmlFor="friday">Fri</label>
                <input type="checkbox" id="saturday" />
                <label htmlFor="saturday">Sat</label>
                <input type="checkbox" id="sunday" />
                <label htmlFor="sunday">Sun</label>
            </span>
        </>
    )
}

Weekdays.propTypes = {
    handle: PropTypes.func.isRequired,
};

export default Weekdays;