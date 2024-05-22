import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { addEvent, getUserContactLists } from '../../service/database-service';
import './AddEvent.css';

const AddEvent = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([isLoggedIn.user]);
    const [inputValue, setInputValue] = useState('');
    const [form, setForm] = useState({
        author: '', title: '', description: '', 
        startDate: '', startTime: '', endDate: '', endTime: '', 
        visibility: '', invitedUsers: [], canInvite: false, 
        locationType: '', location: '', type: 'single'
    });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getContacts = async () => {
            try {
                setLoading(true);
                const data = await getUserContactLists(isLoggedIn.user);
                const allContacts = Object.values(data)
                                .map(contactList => contactList.contacts)
                                .flat()
                                .filter(contact => contact !== undefined);
                setLoading(false);
                setContacts(allContacts);
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        }
        getContacts();
    }, []);

    useEffect(() => {
        const handleAddEvent = async () => {
            console.log(form);
            try {
                setLoading(true);
                await addEvent(form);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }
        }
        if (isFormSubmitted) handleAddEvent();
    }, [form]);

    const handleSingleEventTabClick = () => {
        console.log('Single Event Tab Clicked');
    }

    const handleSeriesEventTabClick = () => {
        console.log('Series Event Tab Clicked');
    }

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
        const type = "single";

        setForm({author, title, description, startDate, startTime, endDate, endTime, 
                visibility, invitedUsers, canInvite, locationType, location, type});
        
        setIsFormSubmitted(true);
    }

    const handleInviteChange = (event) => {
        setInputValue(event.target.value);
        const emailInput = event.target.value;
        const filteredContacts = contacts.filter(contact => contact.includes(emailInput));
        if (filteredContacts.length === 0 || emailInput === '') {
            setSuggestions([]);
        } else {
            setSuggestions(filteredContacts);
        }
    }

    const handleSuggestionClick = (email) => {
        if (!invitedUsers.includes(email)) {
            setInvitedUsers([...invitedUsers, email]);
        }
        setInputValue('');
        setSuggestions([]);
    }

    if (loading) {
        return (
            <div className='spinner'></div>
        )
    }

    return (
        <>  
            <h1>Add Event</h1>
            {error && <p className="error">{error}</p>}
            <div role="tablist" className="tabs tabs-lifted">
                <a role="tab" className="tab tab-active" onClick={handleSingleEventTabClick}>Single</a>
                <a role="tab" className="tab" onClick={handleSeriesEventTabClick}>Series</a>
            </div>

            <form onSubmit={formSubmit} onClick={() => setSuggestions([])} className="event-form">
                <label htmlFor="title" className="required formbold-form-label"> Title </label>
                <input type="text" id="title" name="title" className="formbold-form-input" required />
                <br />
                <br />

                <label htmlFor="description" className="formbold-form-label"> Description </label>
                <textarea id="description" name="description" className="formbold-form-input" placeholder="Description"></textarea>
                <br />
                <br />

                <label htmlFor="startDate" className="required formbold-form-label"> Start Date </label>
                <input type="date" id="startDate" name="startDate" className="formbold-form-input" required/>

                <label htmlFor="startTime" className="required formbold-form-label"> Time </label>
                <input type="time" id="startTime" name="startTime" className="formbold-form-input" required/>
                <br />
                <br />

                <label htmlFor="endDate" className="required formbold-form-label"> End Date </label>
                <input type="date" id="endDate" name="endDate" className="formbold-form-input" required/>

                <label htmlFor="endTime" className="required formbold-form-label"> Time </label>
                <input type="time" id="endTime" name="endTime" className="formbold-form-input" required/>
                <br />
                <br />

                <label htmlFor="visibility" className="required formbold-form-label"> Visibility </label>
                <select name="visibility" id="visibility" className="formbold-form-input" required>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                <br />
                <br />

                <div className="email-suggestion-container">
                    <label htmlFor="invitedUsers" className="formbold-form-label"> Invited Users </label>
                    <input type="text" 
                        id="invitedUsers" 
                        name="invitedUsers" 
                        value={inputValue}
                        placeholder="Type an email address" 
                        onChange={handleInviteChange} 
                        className="formbold-form-input"
                    />
                    {suggestions.length ? 
                        <div className="suggestions">
                            {suggestions.map((email, index) => (
                                <div key={index} 
                                    className="suggestion-item" 
                                    onClick={() => handleSuggestionClick(email)}>
                                    {email}
                                </div>
                            ))}
                        </div>
                        : null
                    }
                </div>
                {invitedUsers.length ?  
                    <div className="invited-users">
                        {invitedUsers.map((email, index) => (
                            <div key={index} className="invited-user">
                                {email}
                            </div>
                        ))}
                    </div>
                    : null
                }
                <br />

                <label htmlFor="canInvite" className="required formbold-checkbox-label">
                    Allow invited users to invite others 
                <input type="checkbox" id="canInvite" name="canInvite" required/>
                <span className="checkmark"></span>
                </label>
                <br />

                <label htmlFor="locationType" className="required formbold-form-label"> Location Type </label>
                <select name="locationType" id="locationType" className="formbold-form-input" required>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                </select>
                <br />
                <br />

                <label htmlFor="location" className="required formbold-form-label"> Location </label>
                <input type="text" name="location" id="location" className="formbold-form-input" required/>
                <br />
                <br />

                <label htmlFor="upload" className="formbold-form-label">
                Upload Image
                </label>
                <input
                    type="file"
                    name="upload"
                    id="upload"
                    className="formbold-form-input formbold-form-file"
                />
                <br />
                <br />

                <button type="submit" className="formbold-btn">Add event</button>
            </form>
        </>
       
    )
}

export default AddEvent;