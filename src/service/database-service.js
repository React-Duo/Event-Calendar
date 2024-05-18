import { database } from '../config/firebase-config.js';
import { ref, get, set, update, query, equalTo, orderByChild, goOnline } from "firebase/database";

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
