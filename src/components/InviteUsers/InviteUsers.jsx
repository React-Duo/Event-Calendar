import { useContext, useEffect, useState } from "react";
import { getUserContactLists, getUserDetails } from "../../service/database-service";
import AuthContext from "../../context/AuthContext";
import PropTypes from 'prop-types';


const InviteUsers = (props) => {
    const { isLoggedIn } = useContext(AuthContext);
    const [contactsWithPhoto, setContactsWithPhoto] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const getContacts = async () => {
            try {
                const contactLists = await getUserContactLists(isLoggedIn.user);
                if (contactLists) {
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
                }

                if (props.invited) {
                    const invited = props.invited.map(async user => {
                        const userDetails = await getUserDetails(user);
                        return { email: user, photo: userDetails[0].photo };
                    });
                    const invitedUsersWithPhotos = await Promise.all(invited);
                    props.setInvitedUsers(invitedUsersWithPhotos);
                } else {
                    const isCurrentUserInvited = props.invitedUsers.find(user => user.email === isLoggedIn.user);
                    if (!isCurrentUserInvited) {
                        const currentUserDetails = await getUserDetails(isLoggedIn.user);
                        props.setInvitedUsers([...props.invitedUsers, {email: isLoggedIn.user, photo: currentUserDetails[0].photo}]);
                    }
                }
            } catch (error) {
                props.setError(error.message);
            }
        }
        if (!contactsWithPhoto.length) getContacts();
    }, []);

    const handleInviteChange = (event) => {
        setInputValue(event.target.value);
        const emailInput = event.target.value;
        const filteredContacts = contactsWithPhoto.filter(contact => contact.email.includes(emailInput));        
        if (filteredContacts.length === 0 || emailInput === '') {
            props.setSuggestions([]);
        } else {
            props.setSuggestions(filteredContacts);
        }
    }

    const handleRemoveUser = (email) => {
        props.setInvitedUsers(props.invitedUsers.filter(user => user.email !== email));
    };

    const handleSuggestionClick = (suggestion) => {
        const isUserAlreadyInvited = props.invitedUsers.find(user => user.email === suggestion.email);
        if (!isUserAlreadyInvited) {
            suggestion = {...suggestion, remove: true};
            props.setInvitedUsers([...props.invitedUsers, suggestion]);
        }
        setInputValue('');
        props.setSuggestions([]);
    }

    return (
        (props.editStatus || props.inviteStatus) ?
        <>
                    <p> 
                        <span>Invite: </span> 
                        <input type="text" 
                                id="invitedUsers"
                                name="invitedUsers"
                                value={inputValue}
                                placeholder="Type an email address" 
                                onChange={handleInviteChange} 
                                className="common"
                        />
                    </p>
                    {props.suggestions.length !== 0 && 
                        <div className="suggestions">
                            {props.suggestions.filter((contact, index, array) => {
                                return index === array.findIndex(c => c.email === contact.email);
                                })
                                .map((suggestion) => (
                                    <div key={suggestion.email} className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)}>
                                        <img src={suggestion.photo} alt="" /> <span>{suggestion.email}</span>
                                    </div>
                                ))
                            }
                        </div>
                    }
                {props.invitedUsers.length &&
                    <div className="invited-users">
                        {props.invitedUsers.map(user => 
                            <div key={user.email} className="invited-user">
                                <img src={user.photo} alt="" /> <span>{user.email}</span>
                                {user.remove ? 
                                    <button onClick={() => handleRemoveUser(user.email)}>X</button>
                                    : 
                                    (props.event && 
                                        (props.event.author === isLoggedIn.user &&
                                            (user.email !== isLoggedIn.user &&
                                                <button onClick={() => handleRemoveUser(user.email)}>X</button>
                                            )
                                        )
                                    )
                                }
                            </div>
                        )}
                    </div>
                }
        </>
        : 
        (props.invitedUsers.length &&
            <>
                <p>
                    <span>Invited: </span>
                </p>
                <div className="invited-users">
                    {props.invitedUsers.map(user => 
                        <div key={user.email} className="invited-user">
                            <img src={user.photo} alt="" /> <span>{user.email}</span>
                        </div>
                    )}
                </div>
            </>
        )
    );
}

InviteUsers.propTypes = {
    editStatus: PropTypes.bool,
    inviteStatus: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    invitedUsers: PropTypes.array,
    setInvitedUsers: PropTypes.func,
    suggestions: PropTypes.array,
    setSuggestions: PropTypes.func,
    event: PropTypes.object,
    invited: PropTypes.array,
    setError: PropTypes.func,
};

export default InviteUsers;