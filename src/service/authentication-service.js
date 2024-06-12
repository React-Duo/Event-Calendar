import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser, updatePassword } from 'firebase/auth';
import { auth } from '../config/firebase-config.js';

/**
 * Registers a new user with the provided email address and password.
 * @param {string} emailAddress - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object|string>} - A promise that resolves to the user credentials if successful, or an error message if unsuccessful.
 */
export const registerUser = async (emailAddress, password) => {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, emailAddress, password);
        return userCredentials;
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * Handles the deletion of a user.
 * @returns {Promise<void>} A promise that resolves when the user is deleted successfully.
 */
export const handleUserDelete = async () => {
    try {
        return await deleteUser(auth.currentUser);
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
        const userCredentials = await signInWithEmailAndPassword(auth, emailAddress, password);
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
        await signOut(auth);
    } catch (error) {
        console.log(error.message);
    }
}

/**
 * Changes the password for the current user.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<void>} - A promise that resolves when the password is successfully updated.
 */
export const changePassword = async (newPassword) => {
    try {
        updatePassword(auth.currentUser, newPassword)
    } catch (error) {
        console.log(error.message);
    }
};