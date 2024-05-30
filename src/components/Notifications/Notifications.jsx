import "./Notifications.css"
import dayjs from "dayjs"
import PropTypes from 'prop-types';
const Notifications = ({ alerts }) => {

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <h3>Notifications</h3>
            </div>
            <div className="notifications-content">
                {alerts.length === 0 ? <p>No alerts</p> : alerts.map((alert, index) => {
                    return <p className="event-alert" key={index}>Event: {alert.title} is starting at {dayjs(alert.startDate).format("dddd, DD MMMM")} in {alert.startTime}</p>
                })}
            </div>
        </div>
    )
}

Notifications.propTypes = {
    alerts: PropTypes.array.isRequired
};


export default Notifications