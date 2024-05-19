import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfUserExists, createUser } from '../../service/database-service.js';
import { handleUserDelete, registerUser } from '../../service/authentication-service.js';
import AuthContext from '../../context/AuthContext.jsx';
import './Register.css';
import { NAME_MIN_CHARS, NAME_MAX_CHARS, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, 
        PASSWORD_MIN_CHARS, PASSWORD_MAX_CHARS, EMAIL_REGEX, 
        PHONE_REGEX, PHONE_DIGITS, ADDRESS_MIN_CHARS, ADDRESS_MAX_CHARS, ADRESS_REGEX, 
        DIGIT_REGEX, LETTER_REGEX, ALPHA_NUMERIC_REGEX, SPECIAL_CHARS_REGEX } from '../../common/constants.js';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRegSuccessful, setIsRegSuccessful] = useState(false);
    const [enterWebsite, setEnterWebsite] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        emailAddress: '',
        username: '',
        password: ''
    });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const navigate = useNavigate(); 
    const { setLoginState } = useContext(AuthContext);

    useEffect(() => {
        if (isFormSubmitted) {
            const registrationHandler = async () => {
                try {
                    setLoading(true);
                    const userCredentials = await registerUser(form.emailAddress, form.password);
                    if (!userCredentials) {
                        throw new Error(`User with ${form.emailAddress} email address could not be created.`);
                    }
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
                        username: form.username, 
                        phone: form.phoneNumber,
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
                navigate('/');
            }
        }
    }, [enterWebsite, isRegSuccessful]);

    const register = (event) => {
        event.preventDefault();        
        const firstName = event.target.firstName.value;
        const lastName = event.target.lastName.value;
        const emailAddress = event.target.email.value;
        const phoneNumber = event.target.phone.value;
        const address = event.target.address.value;
        const username = event.target.username.value;
        const password = event.target.password.value;

        if (firstName.length < NAME_MIN_CHARS || firstName.length > NAME_MAX_CHARS || !LETTER_REGEX.test(firstName)) {
            setError(`First name must contain upper- and lowercase letters only and must be between ${NAME_MIN_CHARS}-${NAME_MAX_CHARS} characters long.`);
            return;
        }

        if (lastName.length < NAME_MIN_CHARS || lastName.length > NAME_MAX_CHARS || !LETTER_REGEX.test(lastName)) {
            setError(`Last name must contain upper- and lowercase letters only and must be between ${NAME_MIN_CHARS}-${NAME_MAX_CHARS} characters long.`); 
            return;
        }

        if (!EMAIL_REGEX.test(emailAddress)) {
            setError(`${emailAddress} is not a valid email address.`);
            return;
        }

        if (!PHONE_REGEX.test(phoneNumber)) {
            setError(`Phone number must contain ${PHONE_DIGITS} digits.`);
            return;
        }

        if (!ADRESS_REGEX.test(address)) {
            setError(`Address must contain ${ADDRESS_MIN_CHARS}-${ADDRESS_MAX_CHARS} characters, uppercase/lowercase letters, digits and space/dot.`);
            return;
        }

        if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH || !ALPHA_NUMERIC_REGEX.test(username)) {
            setError(`${username} is not a valid username.`);
            return;
        }

        if (password.length < PASSWORD_MIN_CHARS || password.length > PASSWORD_MAX_CHARS || !LETTER_REGEX.test(password)
            || !DIGIT_REGEX.test(password) || !SPECIAL_CHARS_REGEX.test(password)) {
                setError(`The provided password is invalid.`);
                return;
        }

        setForm({ firstName, lastName, emailAddress, phoneNumber, username, password });
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
            <h2>Register</h2>
            {error && <div>{error}</div>} <br />
            <span><label htmlFor="firstName" className="required">First Name </label><input type="text" name="firstName" id='firstName' required /></span> <br />
            <h5><i>/ First name must be between {NAME_MIN_CHARS}-{NAME_MAX_CHARS} characters long. /</i></h5> <br />
            <span><label htmlFor="lastName" className="required">Last Name </label><input type="text" name="lastName" id='lastName' required /></span> <br />
            <h5><i>/ Last name must be between {NAME_MIN_CHARS}-{NAME_MAX_CHARS} characters long. /</i></h5> <br />
            <span><label htmlFor="email" className="required">Email address </label><input type="email" name="email" id='email' required /></span> <br />
            <span><label htmlFor="phone" className="required">Phone Number </label><input type="text" name="phone" id='phone' required /></span> <br />
            <h5><i>/ Phone number must contain {PHONE_DIGITS} digits exactly. /</i></h5> <br />
            <span><label htmlFor="address">Address </label><input type="text" name="address" id='address' /></span> <br />
            <h5><i>/ Address must contain {ADDRESS_MIN_CHARS}-{ADDRESS_MAX_CHARS} characters, uppercase/lowercase letters, digits and space/dot. /</i></h5> <br />
            <span><label htmlFor="username" className="required">Username </label><input type="text" name="username" id='username' required /></span> <br />
            <h5><i>/ Username must contain {USERNAME_MIN_LENGTH}-{USERNAME_MAX_LENGTH} characters, uppercase/lowercase letters and digits only. /</i></h5> <br />
            <span><label htmlFor="password" className="required">Password </label><input type="password" name="password" id='password' required /></span> <br />
            <h5><i>/ Password must contain {PASSWORD_MIN_CHARS}-{PASSWORD_MAX_CHARS} characters, ONE digit, ONE letter and ONE special character at least. /</i></h5> <br />
            <button type="submit">Register</button>
        </form>
        </div>
    )

}

export default Register;