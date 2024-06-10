import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInUser } from '../../service/authentication-service.js';
import AuthContext from '../../context/AuthContext.jsx';
import { EMAIL_REGEX } from '../../common/constants.js';
import './Login.css';

const Login = () => {
    const { setLoginState } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [form, setForm] = useState({
        emailAddress: '', 
        password: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (isFormSubmitted) {
            const loginHandler = async () => {
                try {
                    setLoading(true);                    
                    const userCredentials = await signInUser(form.emailAddress, form.password);
                    if (!userCredentials) throw new Error(`Incorrect login credentials.`);
                    setIsLoginSuccessful(true);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
            loginHandler();
        }
    }, [form]);

    useEffect(() => {
        if (isLoginSuccessful) {
            setLoginState({status: true, user: form.emailAddress});
            navigate('/home');
        }
    }, [isLoginSuccessful]);

    const loginUser = (event) => {        
        event.preventDefault();
        const emailAddress = event.target.email.value;
        const password = event.target.password.value;
        if (!EMAIL_REGEX.test(emailAddress)) {
            setError(`${emailAddress} is not a valid email address.`);
            return;
        }
        setForm({ emailAddress, password });
        setIsFormSubmitted(true);
    }

    if (loading) {
        return (<div className='spinnerContainer'>
            <div className='spinner'></div>
            </div>
        )
    }

    return (
        <div className='loginContainer'>
        <form onSubmit={loginUser} className="login-form">
        <p>Welcome back <br/> to <span id='span-name'>Calendo</span></p>

            {error && <div>{error}</div>} <br />
            <span className='login-span'><label htmlFor="email">Email address </label>
            <input className='input__field' type="email" name="email" id="email" required /></span> 
            <br />
            <span className='login-span'><label htmlFor="password">Password </label>
            <input className='input__field' type="password" name="password" id='password' required /></span>
            <br />
            <button className='btn' type="submit">Login</button>
            <h5>Don&apos;t have an account?<span onClick={()=> navigate("/register")} id='span-sign-up'> Sign Up</span></h5>
        </form>
        </div>
    )
}

export default Login;