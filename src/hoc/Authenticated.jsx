import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase-config.js';
import AuthContext from '../context/AuthContext';
/**
 * 
 * @param {{children: any }} props 
 * @returns 
 */
export default function Authenticated({ children }) {
    const { isLoggedIn, setLoginState } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        auth.onAuthStateChanged(currentUser => {
            if (currentUser) setLoginState({ status: true, user: currentUser.email });
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (<div className='spinnerContainer'>
                    <div className='spinner'></div>
                </div>
                )
    }
    
    if(!isLoggedIn.user) {
        return <Navigate replace to="/login" state={{ from: location }}/>
    }

    return (
        <>
            {children}
        </>
    )
}

Authenticated.propTypes = {
    children: PropTypes.any.isRequired,
}

