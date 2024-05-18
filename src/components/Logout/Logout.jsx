import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../../service/authentication-service.js';
import AuthContext from '../../Context/AuthContext.jsx';
import './Logout.css';

const Logout = () => {
    const { setLoginState } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [logoutSuccess, setLogoutSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const logoutHandler = async () => {
            try {
                setLoading(true);
                await signOutUser();
                setLogoutSuccess(true);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }
        logoutHandler();
    }, []);

    useEffect(() => {
        if (logoutSuccess) {
            setLoginState({status: false, user: ''});
            navigate('/');
        }
    }, [logoutSuccess]);

    if (loading) {
        return (
            <div className="spinner"></div>
        )
    }
}

export default Logout;