import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkIfUserExists, createUser } from '../../service/database-service.js';
import { handleUserDelete, registerUser } from '../../service/authentication-service.js';
import AuthContext from '../../context/AuthContext.jsx';
import { NAME_MIN_CHARS, NAME_MAX_CHARS, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, 
        PASSWORD_MIN_CHARS, PASSWORD_MAX_CHARS, EMAIL_REGEX, PHONE_REGEX, PHONE_DIGITS, 
        DIGIT_REGEX, LETTER_REGEX, ALPHA_NUMERIC_REGEX, SPECIAL_CHARS_REGEX, DEFAULT_IMAGE, 
        } from '../../common/constants.js';
import Address from '../Address/Address.jsx';
import { isAddressValid } from '../../service/utils.js';
import { auth } from '../../config/firebase-config.js';
import './Register.css';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRegSuccessful, setIsRegSuccessful] = useState(false);
    const [enterWebsite, setEnterWebsite] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        emailAddress: '',
        phoneNumber: '',
        location: {},
        username: '',
        password: '',
        photo: '',
    });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const navigate = useNavigate(); 
    const { setLoginState } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        auth.onAuthStateChanged(currentUser => {
            if (currentUser) {
                setLoginState({ status: true, user: currentUser.email });
                navigate(location.state?.from.pathname || '/home');
            }
        });
    }, []); 

    useEffect(() => {
        if (isFormSubmitted) {
            const registrationHandler = async () => {
                try {
                    setLoading(true);
                    const userCredentials = await registerUser(form.emailAddress, form.password);
                    if (!userCredentials) throw new Error(`User with ${form.emailAddress} email address could not be created.`);
                    
                    const snapshots = await checkIfUserExists(form.username, form.emailAddress, form.phoneNumber);
                    const [user, email, phone] = snapshots;

                    if (user.exists()) {
                        setLoading(false);
                        handleUserDelete();
                        setError(`Username already exists.`);
                        return;
                    }

                    if (email.exists()) {
                        setLoading(false);
                        handleUserDelete();
                        setError(`Email address already exists.`);
                        return;
                    }

                    if (phone.exists()) {
                        setLoading(false);
                        handleUserDelete();
                        setError(`Phone number already exists.`);
                        return;
                    }

                    const creationStatus = await createUser({
                        firstName: form.firstName, 
                        lastName: form.lastName, 
                        email: form.emailAddress, 
                        phone: form.phoneNumber,
                        location: form.location,
                        username: form.username, 
                        photo: form.photo,
                        role: 'author',
                        isBlocked: false,
                    });

                    if (!creationStatus) {
                        setLoading(false);
                        setIsRegSuccessful(true);
                    }

                } catch (error) {
                    setLoading(false);
                    setError(error.message);
                }
            }
            registrationHandler();
        }
    }, [form]);

    useEffect(() => {
        if (isRegSuccessful) {
            if (enterWebsite) {
                setLoginState({status: true, user: form.emailAddress});
                navigate('/home');
            }
        }
    }, [enterWebsite, isRegSuccessful]);

    const register = (event) => {
        event.preventDefault();        
        const firstName = event.target.firstName.value;
        const lastName = event.target.lastName.value;
        const emailAddress = event.target.email.value;
        const phoneNumber = event.target.phone.value;
        const location = {
            country: event.target.country.value,
            city: event.target.city.value,
            street: event.target.street.value,
        };
        const username = event.target.username.value;
        const password = event.target.password.value;

        if (firstName.length < NAME_MIN_CHARS || firstName.length > NAME_MAX_CHARS 
            || !LETTER_REGEX.test(firstName) || DIGIT_REGEX.test(firstName) || SPECIAL_CHARS_REGEX.test(firstName)) {
            setError(`First name must contain upper- and lowercase letters only and must be between ${NAME_MIN_CHARS}-${NAME_MAX_CHARS} characters long.`);
            return;
        }

        if (lastName.length < NAME_MIN_CHARS || lastName.length > NAME_MAX_CHARS 
            || !LETTER_REGEX.test(lastName) || DIGIT_REGEX.test(lastName) || SPECIAL_CHARS_REGEX.test(lastName)) {
            setError(`Last name must contain upper- and lowercase letters only and must be between ${NAME_MIN_CHARS}-${NAME_MAX_CHARS} characters long.`); 
            return;
        }

        if (!EMAIL_REGEX.test(emailAddress)) {
            setError(`${emailAddress} is not a valid email address.`);
            return;
        }

        if (!PHONE_REGEX.test(phoneNumber)) {
            setError(`Phone number must contain ${PHONE_DIGITS} digits exactly.`);
            return;
        }

        if (isAddressValid(location, setError) === 'Address is invalid') return;

        if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH || !ALPHA_NUMERIC_REGEX.test(username)) {
            setError(`${username} is not a valid username.`);
            return;
        }

        if (password.length < PASSWORD_MIN_CHARS || password.length > PASSWORD_MAX_CHARS || !LETTER_REGEX.test(password)
            || !DIGIT_REGEX.test(password) || !SPECIAL_CHARS_REGEX.test(password)) {
                setError(`The provided password is invalid.`);
                return;
        }

        setForm({ firstName, lastName, emailAddress, phoneNumber, location, username, password, photo: DEFAULT_IMAGE});
        setIsFormSubmitted(true);
    }

    if (loading) {
        return (
            <div className='spinner'></div>
        )
    }

    if (isRegSuccessful) {
        return (
            <div className="registration-success">
                <p>Welcome onboard!</p> <br />
                <p>You have registered successfully!</p> <br /> <br />
                <button className="button-43" role="button" onClick={() => setEnterWebsite(true)}>Go to Home page</button>
            </div>
        )
    }

    return (
        <div className='registerContainer'>
        <form onSubmit={register} className="register-form">
        <p>Create your <br/><span id='span-name'>free</span> account</p>
            {error && <div>{error}</div>} <br />
            <span className="input-container">
                <label htmlFor="firstName" className="required">First Name </label>
                <input className='input__field ' type="text" name="firstName" id='firstName' required />
                <h5><i>/{NAME_MIN_CHARS}-{NAME_MAX_CHARS} chars/</i></h5>
            </span>
            <br />

            <span className="input-container">
                <label htmlFor="lastName" className="required">Last Name </label>
                <input className='input__field ' type="text" name="lastName" id='lastName' required />
                <h5><i>/{NAME_MIN_CHARS}-{NAME_MAX_CHARS} chars/</i></h5>
            </span>
            <br />

            <span className="input-container">
                <label htmlFor="email" className="required">Email address </label>
                <input className='input__field ' type="email" name="email" id='email' required />
            </span>
            <br />

            <span className="input-container">
                <label htmlFor="phone" className="required">Phone </label>
                <input className='input__field ' type="text" name="phone" id='phone' required />
                <h5><i>/{PHONE_DIGITS} digits exactly/</i></h5>
            </span>
            <br />
            <label htmlFor="phone" className="required">Address</label>
            <Address />
            <br />

            <span className="input-container">
                <label htmlFor="username" className="required">Username </label>
                <input className='input__field ' type="text" name="username" id='username' required />
                <h5><i>/{USERNAME_MIN_LENGTH}-{USERNAME_MAX_LENGTH} chars, upper-/lowercase, digits/</i></h5>
            </span>
            <br />

            <span className="input-container">
                <label htmlFor="password" className="required">Password </label>
                <input className='input__field ' type="password" name="password" id='password' required />
                <h5><i>/{PASSWORD_MIN_CHARS}-{PASSWORD_MAX_CHARS} chars, at least ONE digit, letter and special char/</i></h5>
            </span>
            <br />

            <button className='btn' type="submit">Register</button>
        </form>
        </div>
    )

}

export default Register;