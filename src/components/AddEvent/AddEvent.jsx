import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { addEvent, getUserContactLists, getUserDetails } from '../../service/database-service';
import './AddEvent.css';
import Weekdays from './Weekdays';
import { getMonthDays } from '../../service/utils';

const AddEvent = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [contactsWithPhoto, setContactsWithPhoto] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [form, setForm] = useState({
        author: '', title: '', description: '', 
        startDate: '', startTime: '', endDate: '', endTime: '', 
        visibility: '', invitedUsers: [], canInvite: false, 
        locationType: '', location: '', repeat: ''
    });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [weeklySchedule, setWeeklySchedule] = useState(false);

    useEffect(() => {
        const getContacts = async () => {
            try {
                setLoading(true);
                const contactLists = await getUserContactLists(isLoggedIn.user);
                const allContacts = Object.values(contactLists)
                                .map(contactList => contactList.contacts)
                                .flat()
                                .filter(contact => contact !== undefined);

                const usersWithPhotos = allContacts.map(async contact => {
                    const usersWithThisEmail = await getUserDetails(contact);
                    if (usersWithThisEmail[0].photo) {
                        return { email: contact, photo: usersWithThisEmail[0].photo };
                    } else {
                        return { email: contact, photo: '' };
                    }
                });

                const contactsWithPhotos = await Promise.all(usersWithPhotos);
                setContactsWithPhoto(contactsWithPhotos);

                const currentUserDetails = await getUserDetails(isLoggedIn.user);
                setInvitedUsers([...invitedUsers, {email: isLoggedIn.user, photo: currentUserDetails[0].photo}]);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        }
        if (!contactsWithPhoto.length) getContacts();
    }, []);

    useEffect(() => {
        const handleAddEvent = async () => {
            try {
                setLoading(true);
                await addEvent(form);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        }
        //if (isFormSubmitted) handleAddEvent();
    }, [form]);

    const formSubmit = (event) => {
        event.preventDefault();
        const author = isLoggedIn.user;
        const title = event.target.title.value;
        const description = event.target.description.value;
        const startDate = event.target.startDate.value;
        const startTime = event.target.startTime.value;
        const endDate = event.target.endDate.value;
        const endTime = event.target.endTime.value;
        const visibility = event.target.visibility.value;
        const canInvite = event.target.canInvite.checked;
        const locationType = event.target.locationType.value;
        const location = event.target.location.value;
        const invited = invitedUsers.map(user => user.email);
        let repeat = event.target.repeat.value;

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
                repeat = {...repeat, weekdays};
            }
        }

        const eventObject = { author, title, description, startDate, startTime, endDate, endTime, 
                                visibility, canInvite, locationType, location, invited, repeat };

        if (repeat !== "single") {
            if (repeat.schedule === "daily") {
                const startDay = new Date(startDate).getDate();
                const startMonth = new Date(startDate).getMonth() + 1;
                const startYear = new Date(startDate).getFullYear();

                const endDay = new Date(endDate).getDate();
                const endMonth = new Date(endDate).getMonth() + 1;
                const endYear = new Date(endDate).getFullYear();

                if (startMonth === endMonth) {
                    for (let i = startDay; i <= endDay; i++) {
                        const newStartDate = `${startYear}-${startMonth}-${i}`;
                        const newEndDate = `${endYear}-${endMonth}-${i}`;
                        const newEvent = {...eventObject, startDate: newStartDate, endDate: newEndDate};
                        console.log(newEvent);
                    }
                } else if (startMonth < endMonth) {
                    for (let i = startMonth; i <= endMonth; i++) {
                        if (i === startMonth) {
                            const numberOfDays = getMonthDays(`${startYear}-${i}`);
                            for (let i = startDay; i <= numberOfDays; i++) {
                                const newStartDate = `${startYear}-${startMonth}-${i}`;
                                const newEndDate = newStartDate;
                                const newEvent = {...eventObject, startDate: newStartDate, endDate: newEndDate};
                                console.log(newEvent);
                            }
                        }  else if (i === endMonth) {
                            for (let i = 1; i <= endDay; i++) {
                                const newStartDate = `${endYear}-${endMonth}-${i}`;
                                const newEndDate = newStartDate;
                                const newEvent = {...eventObject, startDate: newStartDate, endDate: newEndDate};
                                console.log(newEvent);
                            }
                        } else {
                            const numberOfDays = getMonthDays(`${startYear}-${i}`);
                            for (let x = 1; x <= numberOfDays; x++) {
                                const newStartDate = `${startYear}-${i}-${x}`;
                                const newEndDate = newStartDate;
                                const newEvent = {...eventObject, startDate: newStartDate, endDate: newEndDate};
                                console.log(newEvent);
                            }
                        }
                    }
                } else {
                    setError("Start month is greater than end month!");
                    console.log("Invalid date range");
                    return;
                }
            }






        }
        
        setForm(eventObject);
        setIsFormSubmitted(true);
    }

    const handleInviteChange = (event) => {
        setInputValue(event.target.value);
        const emailInput = event.target.value;
        const filteredContacts = contactsWithPhoto.filter(contact => contact.email.includes(emailInput));        
        if (filteredContacts.length === 0 || emailInput === '') {
            setSuggestions([]);
        } else {
            setSuggestions(filteredContacts);
        }
    }

    const handleSuggestionClick = (suggestion) => {
        const isUserAlreadyInvited = invitedUsers.find(user => user.email === suggestion.email);
        if (!isUserAlreadyInvited) {
            setInvitedUsers([...invitedUsers, suggestion]);
        }
        setInputValue('');
        setSuggestions([]);
    }

    const handleRepeatChange = (event) => {
        if (event.target.value === "weekly") {
            setWeeklySchedule(true);
        } else {
            setWeeklySchedule(false);
        }
    }

    const handleWeekdayChange = (e) => {

    }


    if (loading) {
        return (
            <div className='spinner'></div>
        )
    }

    return (
        <>  
            <h1>Add Event</h1>
            <form onSubmit={formSubmit} onClick={() => setSuggestions([])} className="event-form">
                <label htmlFor="title" className="required"> Title </label>
                <input type="text" id="title" name="title" className="common" required />
                <br />
                <br />

                <textarea id="description" name="description" className="common" placeholder="Description"></textarea>
                <br />
                <br />

                <label htmlFor="startDate" className="required"> Start Date </label>
                <input type="date" id="startDate" name="startDate" className="common" required/>

                <label htmlFor="startTime" className="required"> Hour </label>
                <input type="time" id="startTime" name="startTime" className="common" required/>
                <br />
                <br />

                <label htmlFor="repeat" className="required"> Repeat </label>
                <select name="repeat" id="repeat" onChange={handleRepeatChange} className="common" required>
                    <option value="single">One-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                                    
                {weeklySchedule &&  
                    <>
                        <Weekdays handle={handleWeekdayChange}/>
                    </>
                }
                <br />
                <br />

                <label htmlFor="endDate" className="required"> End Date </label>
                <input type="date" id="endDate" name="endDate" className="common" required/>

                <label htmlFor="endTime" className="required"> Hour </label>
                <input type="time" id="endTime" name="endTime" className="common" required/>
                <br />
                <br />

                <span>  
                    <label htmlFor="visibility" className="required"> Visibility </label>
                    <select name="visibility" id="visibility" className="common" required>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>

                    <label htmlFor="canInvite">
                        Allow invited users to invite others 
                    <input type="checkbox" id="canInvite" name="canInvite" className="common" />
                    </label>
                </span>
                <br />
                <br />

                <div className="email-suggestion-container">
                    <label htmlFor="invitedUsers"> Invited Users </label>
                    <input type="text" 
                        id="invitedUsers" 
                        name="invitedUsers" 
                        value={inputValue}
                        placeholder="Type an email address" 
                        onChange={handleInviteChange} 
                        className="common"
                    />
                    {suggestions.length ? 
                        <div className="suggestions">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} 
                                    className="suggestion-item" 
                                    onClick={() => handleSuggestionClick(suggestion)}>
                                    <img src={suggestion.photo} alt="" /> <span>{suggestion.email}</span>
                                </div>
                            ))}
                        </div>
                        : null
                    }
                </div>
                {invitedUsers.length ?  
                    <div className="invited-users">
                        {invitedUsers.map((user, index) => (
                            <div key={index} className="invited-user">
                                <img src={user.photo} alt="" /> <span>{user.email}</span>
                            </div>
                        ))}
                    </div>
                    : null
                }
                <br />

                <label htmlFor="locationType" className="required"> Location Type </label>
                <select name="locationType" id="locationType" className="common" required >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                </select>
                
                <label htmlFor="location" className="required"> Location </label>
                <input type="text" name="location" id="location" className="common" required />
                <br />
                <br />

                <label htmlFor="upload"> Upload Image </label>
                <input type="file" name="upload" id="upload" className="formbold-form-file" />
                <br />
                <br />

                {error && <p className="error">{error}</p>}
                <button type="submit" className="formbold-btn">Add event</button>
            </form>
        </>
       
    )
}

export default AddEvent;