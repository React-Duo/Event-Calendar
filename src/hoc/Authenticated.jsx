import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
/**
 * 
 * @param {{children: any }} props 
 * @returns 
 */
export default function Authenticated({ children }) {
    const { isLoggedIn } = useContext(AuthContext);

    const location = useLocation();

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

