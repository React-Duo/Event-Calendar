import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { addEvent } from '../../service/database-service';
import { getMonthDays, getWeekDay, isAddressValid } from '../../service/utils';
import { DEFAULT_EVENT_IMAGE, MAX_YEAR_SPAN } from '../../common/constants';
import Address from '../Address/Address';
import Weekdays from './Weekdays';
import './AddEvent.css';
import InviteUsers from '../InviteUsers/InviteUsers';

const AddEvent = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const { theme } = useContext(AuthContext);
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [weeklySchedule, setWeeklySchedule] = useState(false);
    const [image, setImage] = useState(null);
    const [isOffline, setIsOffline] = useState(false);
    const [isEventAdded, setIsEventAdded] = useState(false);

    useEffect(() => {
        const handleAddEvent = async () => {
            try {
                setLoading(true);
                await addEvent(events);
                setIsEventAdded(true);
                setLoading(false);
                setError(null);
            } catch (error) {
                setLoading(false);
                setError(error.message);
                console.log(error.message);
            }
        }
        if (isFormSubmitted) handleAddEvent();
    }, [events]);

    useEffect(() => {
        if (isEventAdded) {
            setIsEventAdded(false);
            navigate(`/calendar`);
        }
    }, [isEventAdded]);

    const formSubmit = (event) => {
        event.preventDefault();
        let repeat = event.target.repeat.value;
        const invited = invitedUsers.map(user => user.email);
        const [author, title, description, startDate, startTime, endDate, endTime, 
                visibility, canInvite, locationType] = 
            [ 
                isLoggedIn.user, event.target.title.value, event.target.description.value, 
                event.target.startDate.value, event.target.startTime.value, event.target.endDate.value, 
                event.target.endTime.value, event.target.visibility.value, event.target.canInvite.checked, 
                event.target.locationType.value
            ];
   
        if (repeat !== "single") {
            repeat = {schedule: repeat};
            if (event.target.repeat.value === "weekly") {
                const weekdays = [];
                if (event.target.monday.checked) weekdays.push("Monday");
                if (event.target.tuesday.checked) weekdays.push("Tuesday");
                if (event.target.wednesday.checked) weekdays.push("Wednesday");
                if (event.target.thursday.checked) weekdays.push("Thursday");
                if (event.target.friday.checked) weekdays.push("Friday");
                if (event.target.saturday.checked) weekdays.push("Saturday");
                if (event.target.sunday.checked) weekdays.push("Sunday");

                if (weekdays.length === 0) {
                    setError("Select at least one weekday!");
                    console.log("Select at least one weekday!");
                    return;
                } 
                repeat = {...repeat, weekdays};
            }
        }

        const photo = image ? image : DEFAULT_EVENT_IMAGE;

        const eventObject = { author, title, description, startDate, startTime, endDate, endTime, 
                                visibility, canInvite, locationType, invited, repeat, photo };

        if (event.target.location?.value) eventObject.location = event.target.location.value;
        else {
            const [country, city, street] = 
                [event.target.country.value, event.target.city.value, event.target.street.value];
            const location = { country, city, street };
            if (isAddressValid(location, setError) === 'Address is invalid') return;
            eventObject.location = { country, city, street };
        }

        const [startDay, startMonth, startYear] = 
            [ new Date(startDate).getDate(), new Date(startDate).getMonth() + 1, new Date(startDate).getFullYear() ];
        const [endDay, endMonth, endYear] = 
            [ new Date(endDate).getDate(), new Date(endDate).getMonth() + 1, new Date(endDate).getFullYear() ];
        const events = [];   
        if (repeat !== "single") events.push({...eventObject});
        
        const today = new Date().toISOString().split('T')[0];
        const startHour = new Date(`${today}T${startTime}:00`);
        const endHour = new Date(`${today}T${endTime}:00`);

        if (startYear > endYear) {
            setError("Start year is greater than end year!");
            console.log("Invalid date range");
            return;
        } 
        
        if (startYear === endYear) {
            if (startMonth > endMonth) {
                setError("Start month is greater than end month!");
                console.log("Invalid date range");
                return;
            }
            if (startMonth === endMonth) {
                if (startDay > endDay) {
                    setError("Start day is greater than end day!");
                    console.log("Invalid date range");
                    return;
                }

                if (startDay === endDay) {
                    if (startHour > endHour) {  
                        setError("Start time is greater than end time!");
                        console.log("Invalid time range");  
                        return;
                    }

                    events.push({...eventObject});
                }

                if (startDay < endDay) {
                    if (repeat === "single") events.push({...eventObject});

                    if (repeat !== "single") {
                        if (startHour > endHour) {  
                            setError("Start time is greater than end time!");
                            console.log("Invalid time range");  
                            return;
                        }

                        for (let currentDate = startDay; currentDate <= endDay; currentDate++) {
                            const date = `${startYear}-${startMonth}-${currentDate}`;
                            if (repeat.schedule === "daily") events.push({...eventObject, startDate: date, endDate: date});
                            if (repeat.schedule === "weekly") {
                                const weekday = getWeekDay(new Date(date).getDay());
                                if (repeat.weekdays.includes(weekday)) events.push({...eventObject, startDate: date, endDate: date});
                            }
                        }
                    }
                }
            }
            if (startMonth < endMonth) {
                if (repeat === "single") events.push({...eventObject});

                if (repeat !== "single") {
                    if (startHour > endHour) {  
                        setError("Start time is greater than end time!");
                        console.log("Invalid time range");  
                        return;
                    }

                    for (let currentMonth = startMonth; currentMonth <= endMonth; currentMonth++) {
                        if (currentMonth === startMonth) {
                            const monthDays = getMonthDays(`${startYear}-${startMonth}`);
                            for (let currentDate = startDay; currentDate <= monthDays; currentDate++) {
                                const date = `${startYear}-${startMonth}-${currentDate}`;
                                if (repeat.schedule === "daily") events.push({...eventObject, startDate: date, endDate: date});
                                if (repeat.schedule === "weekly") {
                                    const weekday = getWeekDay(new Date(date).getDay());
                                    if (repeat.weekdays.includes(weekday)) events.push({...eventObject, startDate: date, endDate: date});
                                }
                            }
                        }
                        
                        if (currentMonth === endMonth) {
                            for (let currentDate = 1; currentDate <= endDay; currentDate++) {
                                const date = `${startYear}-${endMonth}-${currentDate}`;
                                if (repeat.schedule === "daily") events.push({...eventObject, startDate: date, endDate: date});
                                if (repeat.schedule === "weekly") {
                                    const weekday = getWeekDay(new Date(date).getDay());
                                    if (repeat.weekdays.includes(weekday)) events.push({...eventObject, startDate: date, endDate: date});
                                }
                            }
                        } 
                        
                        if (currentMonth !== startMonth && currentMonth !== endMonth) {
                            const monthDays = getMonthDays(`${startYear}-${currentMonth}`);
                            for (let currentDate = 1; currentDate <= monthDays; currentDate++) {
                                const date = `${startYear}-${currentMonth}-${currentDate}`;
                                if (repeat.schedule === "daily") events.push({...eventObject, startDate: date, endDate: date});
                                if (repeat.schedule === "weekly") {
                                    const weekday = getWeekDay(new Date(date).getDay());
                                    if (repeat.weekdays.includes(weekday)) events.push({...eventObject, startDate: date, endDate: date});
                                }
                            }
                        }
                    }
                }
            } 
        } 
        
        if (startYear < endYear) {
            if (endYear - startYear > MAX_YEAR_SPAN) {
                setError(`Allowed year range is ${MAX_YEAR_SPAN} years!`);
                console.log("Year range is too long!");
                return;
            }

            if (repeat === "single") events.push({...eventObject});
            
            if (repeat !== "single") {
                if (startHour > endHour) {  
                    setError("Start time is greater than end time!");
                    console.log("Invalid time range");  
                    return;
                }
                
                for (let currentYear = startYear; currentYear <= endYear; currentYear++) {
                    if (currentYear === startYear) {
                        for (let currentMonth = startMonth; currentMonth <= 12; currentMonth++) {
                            if (currentMonth === startMonth) {
                                const monthDays = getMonthDays(`${startYear}-${startMonth}`);
                                for (let currentDate = startDay; currentDate <= monthDays; currentDate++) {
                                    const date = `${startYear}-${startMonth}-${currentDate}`;
                                    if (repeat.schedule === "daily") events.push({...eventObject, startDate: date, endDate: date});
                                    if (repeat.schedule === "weekly") {
                                        const weekday = getWeekDay(new Date(date).getDay());
                                        if (repeat.weekdays.includes(weekday)) events.push({...eventObject, startDate: date, endDate: date});
                                    }
                                }
                            } 
                            if (currentMonth !== startMonth) {
                                const monthDays = getMonthDays(`${startYear}-${currentMonth}`);
                                for (let currentDate = 1; currentDate <= monthDays; currentDate++) {
                                    const date = `${startYear}-${currentMonth}-${currentDate}`;
                                    if (repeat.schedule === "daily") events.push({...eventObject, startDate: date, endDate: date});
                                    if (repeat.schedule === "weekly") {
                                        const weekday = getWeekDay(new Date(date).getDay());
                                        if (repeat.weekdays.includes(weekday)) events.push({...eventObject, startDate: date, endDate: date});
                                    }
                                }
                            }
                        }
                    } 
                    
                    if (currentYear === endYear) {
                        for (let currentMonth = 1; currentMonth <= endMonth; currentMonth++) {
                            if (currentMonth !== endMonth) { 
                                const monthDays = getMonthDays(`${endYear}-${currentMonth}`);
                                for (let currentDate = 1; currentDate <= monthDays; currentDate++) {
                                    const date = `${endYear}-${currentMonth}-${currentDate}`;
                                    if (repeat.schedule === "daily") events.push({...eventObject, startDate: date, endDate: date});
                                    if (repeat.schedule === "weekly") {
                                        const weekday = getWeekDay(new Date(date).getDay());
                                        if (repeat.weekdays.includes(weekday)) events.push({...eventObject, startDate: date, endDate: date});
                                    }
                                }
                            }

                            if (currentMonth === endMonth) {
                                for (let currentDate = 1; currentDate <= endDay; currentDate++) {
                                    const date = `${endYear}-${endMonth}-${currentDate}`;
                                    if (repeat.schedule === "daily") events.push({...eventObject, startDate: date, endDate: date});
                                    if (repeat.schedule === "weekly") {
                                        const weekday = getWeekDay(new Date(date).getDay());
                                        if (repeat.weekdays.includes(weekday)) events.push({...eventObject, startDate: date, endDate: date});
                                    }
                                }
                            } 
                        }
                    } 
                    
                    if (currentYear !== startYear && currentYear !== endYear) {
                        for (let currentMonth = 1; currentMonth <= 12; currentMonth++) {
                            const monthDays = getMonthDays(`${currentYear}-${currentMonth}`);
                            for (let currentDate = 1; currentDate <= monthDays; currentDate++) {
                                const date = `${currentYear}-${currentMonth}-${currentDate}`;
                                if (repeat.schedule === "daily") events.push({...eventObject, startDate: date, endDate: date});
                                if (repeat.schedule === "weekly") {
                                    const weekday = getWeekDay(new Date(date).getDay());
                                    if (repeat.weekdays.includes(weekday)) events.push({...eventObject, startDate: date, endDate: date});
                                }
                            }
                        } 
                    }
                }
            }
        }

        setEvents(events);
        setIsFormSubmitted(true);
    }

    const handleRepeatChange = (event) => {
        if (event.target.value === "weekly") {
            setWeeklySchedule(true);
        } else {
            setWeeklySchedule(false);
        }
    }

    const handleLocationTypeChange = (event) => {
        if (event.target.value === "offline") setIsOffline(true);
        else setIsOffline(false);
    }

    if (loading) {
        return (
            <div className='spinner'></div>
        )
    }

    return (
        <div className={`container-content ${theme && "dark-theme-add-event" }`}> 
            <h1>Add Event</h1>
            <form onSubmit={formSubmit} onClick={() => setSuggestions([])} className="event-form">
                <label htmlFor="title" className="required"> Title </label>
                <input type="text" id="title" name="title" className="input__field" required />
                
                <textarea id="description" name="description" className="input__field" placeholder="Description"></textarea>
                
                <label htmlFor="startDate" className="required"> Start Date </label>
                <input type="date" id="startDate" name="startDate" className="input__field" required/>
                
                <label htmlFor="startTime" className="required"> Hour </label>
                <input type="time" id="startTime" name="startTime" className="input__field" required/>

                <label htmlFor="repeat" className="required"> Repeat </label>
                <select name="repeat" id="repeat" onChange={handleRepeatChange} className="input__field" required>
                    <option value="single">One-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                                    
                { weeklySchedule &&  <> <Weekdays /> </> }
                
                <label htmlFor="endDate" className="required"> End Date </label>
                <input type="date" id="endDate" name="endDate" className="input__field" required/>
                
                <label htmlFor="endTime" className="required"> Hour </label>
                <input type="time" id="endTime" name="endTime" className="input__field" required/>
                
                <span>  
                    <label htmlFor="visibility" className="required"> Visibility </label>
                    <select name="visibility" id="visibility" className="input__field" required>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>

                    <label htmlFor="canInvite">
                        Allow invited users to invite others 
                    <input type="checkbox" id="canInvite" name="canInvite" className="input__field" />
                    </label>
                </span>
                
               <InviteUsers suggestions={suggestions} setSuggestions={setSuggestions} 
                            invitedUsers={invitedUsers} setInvitedUsers={setInvitedUsers} 
                            error={error} setError={setError} editStatus="true"
                />

                <label htmlFor="locationType" className="required"> Location Type </label>
                <select name="locationType" id="locationType" onChange={handleLocationTypeChange} className="input__field" required >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                </select>

                {isOffline ? <><Address /></> : (
                    <>
                        <label htmlFor="location" className="required"> Location </label>
                        <input type="text" name="location" id="location" className="input__field" required />
                    </>
                )} 
            
                <label htmlFor="upload"> Upload Image </label>
                <input type="file" name="upload" id="upload" className="formbold-form-file" onChange={e => setImage(e.target.files[0])} />
                {image && <img src={URL.createObjectURL(image)} alt="event" className="event-image" />}
                
                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn">Add event</button>
            </form>
        </div>
       
    )
}

export default AddEvent;