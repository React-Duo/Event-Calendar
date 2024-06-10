import { useEffect, useState } from 'react';
import { editCredential, searchUser } from '../../service/database-service';
import './Admin.css';

const Admin = () => {
    const [searchParams, setSearchParams] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState(null);
    const [userBlock, setUserBlock] = useState(null);

    useEffect(() => {
        const handleUserSearch = async () => {
            try {
                setLoading(true);
                const data = await searchUser(searchParams.searchString, searchParams.searchTerm);
                if (!data) throw new Error("No users matched the search criteria.");
                
                console.log(data);

                const filteredUsers = Object.entries(data).map(([key, user]) => user = {id: key, ...user});
                setUsers(filteredUsers);
                setError(null);
            } catch (error) {
                setUsers(null);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        if (searchParams) handleUserSearch();
    }, [searchParams, userBlock]);

    useEffect(() => {
        const handleUserBlock = async () => {
            try {
                setLoading(true);
                if (userBlock.isBlocked) await editCredential(userBlock.id, "isBlocked", false);
                else await editCredential(userBlock.id, "isBlocked", true);
                setError(null);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
                setUserBlock(null);
            }
        }
        if (userBlock) handleUserBlock();
    }, [userBlock]);

    const handleSearchForm = (e) => {
        e.preventDefault();
        const searchString = e.target.searchField.value;
        const searchTerm = e.target.searchType.value;
        setSearchParams({ searchString, searchTerm });
    }

    if (loading) {
        return <div className="spinner"></div>
    }

    return (
        <div className="usersContainer">
            <form onSubmit={handleSearchForm} className="search-form">
                <input type="text" id="searchField" name="searchField" placeholder="Search users..." required/>
                <br />
                <span>
                    <input type="radio" value="firstName" id="firstName" name="searchType" required /> 
                    <label className='labelText' htmlFor="firstName">First Name</label>
                    <input type="radio" value="lastName" id="lastName" name="searchType" required /> 
                    <label className='labelText' htmlFor="lastName">Last Name</label>
                    <input type="radio" value="emailAddress" id="emailAddress" name="searchType" required /> 
                    <label className='labelText' htmlFor="emailAddress">Email Address</label>
                    <input type="radio" value="username" id="username" name="searchType" required /> 
                    <label className='labelText' htmlFor="username">Username</label>
                </span>
                <br />
                <button type="submit">Search</button>
            </form>
            {error && <div id="error">{error}</div>}
            {users && 
                <div className="users-list">
                    {users.map(user => {
                        return <div className="user-details" key={user.id}>
                                    <img src={user.photo} alt="" />
                                    <div>
                                        <label htmlFor="">Display Name: </label> {user.firstName} {user.lastName} {user.role === "admin" && "(Admin)"} 
                                        <br />
                                        <label htmlFor="">Email address: </label> {user.email} <br />
                                        <label htmlFor="">Username: </label> {user.username} <br />
                                        {user.role !== "admin" && 
                                            (user.isBlocked ? 
                                                <button onClick={() => setUserBlock(user)}>Unblock user</button>
                                                :
                                                <button onClick={() => setUserBlock(user)}>Block user</button>
                                            )
                                        }
                                    </div>
                                </div> 
                    })}
                </div>
            }
        </div>
    )
}

export default Admin;