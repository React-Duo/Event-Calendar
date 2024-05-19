import { database } from '../config/firebase-config.js';
import { ref, get, set, update, query, equalTo, orderByChild } from "firebase/database";

/**
 * Checks if a user exists in the database.
 * @param {string} username - The username of the user to check.
 * @returns {Promise<Snapshot | string>} - A promise that resolves to a snapshot of the user data if the user exists, or an error message if the user does not exist.
 */
export const checkIfUserExists = async (username, email, phone) => {
  try {
    const snapshot1 = await get(query(ref(database, "users"), orderByChild("username"), equalTo(username)));        
    const snapshot2 = await get(query(ref(database, "users"), orderByChild("email"), equalTo(email)));
    const snapshot3 = await get(query(ref(database, "users"), orderByChild("phone"), equalTo(phone)));

    return [snapshot1, snapshot2, snapshot3];
  } catch (error) {
    console.log(error.message);
  } 
}

/**
 * Creates a new user in the database.
 * @param {Object} userDetails - The details of the user to be created.
 * @returns {Promise<string|undefined>} - A promise that resolves to the created user's details or an error message if an error occurs.
 */
export const createUser = async (userDetails) => {
  try {
    return await set(ref(database, `users/${userDetails.username}`), userDetails);
  } catch (error) {
      console.log(error.message);
  }
}
