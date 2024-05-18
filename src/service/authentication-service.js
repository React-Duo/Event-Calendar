import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
import { app } from '../config/firebase-config.js';

/**
 * Registers a new user with the provided email address and password.
 * @param {string} emailAddress - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object|string>} - A promise that resolves to the user credentials if successful, or an error message if unsuccessful.
 */
export const registerUser = async (emailAddress, password) => {
    try {
        const authObject = getAuth(app);
        const userCredentials = await createUserWithEmailAndPassword(authObject, emailAddress, password);
        return userCredentials;
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * Signs in a user with the provided email address and password.
 * @param {string} emailAddress - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object|string>} - A promise that resolves to the user credentials if successful, or an error message if unsuccessful.
 */
export const signInUser = async (emailAddress, password) => {
    try {
        const authObject = getAuth(app);
        const userCredentials = await signInWithEmailAndPassword(authObject, emailAddress, password);
        return userCredentials;
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * Signs out the user.
 * @returns {Promise<void>} A promise that resolves when the user is signed out.
 */
export const signOutUser = async () => {
    try {
        const authObject = getAuth(app);
        await signOut(authObject);
    } catch (error) {
        console.log(error.message);
    }
}