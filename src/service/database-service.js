import { database } from '../config/firebase-config.js';
import { ref, get, set, update, query, equalTo, orderByChild, push } from "firebase/database";

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

export const getUserContactLists = async (email) => {
  try {
    const snapshot = await get(query(ref(database, "contactLists"), orderByChild("owner"), equalTo(email)));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("Contact list not found!");
    }
  } catch (error) {
    console.log(error.message);
  }
}

export const addEvent = async (events) => { 
  try { 
    return await Promise.all(events.map(async (event) => {
        const response = await push(ref(database, 'events'), event);
        const eventId = response._path.pieces_[1];
        return eventId;
    }));
  } catch (error) {
    console.log(error.message);
  }
}

export const addIdToEvent = async (eventIds) => {
  try {
    return await Promise.all(eventIds.map(async (eventId) => {
      return await update(ref(database, `events/${eventId}`), { id: eventId });
    }));
  } catch (error) {
    console.log(error.message);
  }
}

export const getUsers = async () => {
  try {
    const snapshot = await get(ref(database, "users"));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("Users not found!");
    }
  } catch (error) {
    console.log(error.message);
    } 
};

export const getLists = async () => {
  try {
    const snapshot = await get(ref(database, "contactLists"));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("Contact lists not found!");
    }
  } catch (error) {
    console.log(error.message);
  }
}

export const addList = async (listDetails) => {
  try {
      return await push(ref(database, 'contactLists'), listDetails);
  } catch (error) {
    console.log(error.message);
  }
}

export const getListById = async (id) => {
  try {
    const snapshot = await get(ref(database, `contactLists/${id}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("List not found!");
    }
  } catch (error) {
    console.log(error.message);
  }
}

export const updateList = async (id, listDetails) => {
  try {
    return await update(ref(database, `contactLists/${id}`), listDetails);
  } catch (error) {
    console.log(error.message);
  }
}

export const deleteList = async (id) => {
  try {
    return await set(ref(database, `contactLists/${id}`), null);
  } catch (error) {
    console.log(error.message);
  }
}

export  const getUserDetails = async (email) => {
  try {
    const snapshot = await get(query(ref(database, "users"), orderByChild("email"), equalTo(email)));
    if (snapshot.exists()) {
      const userDetails = Object.values(snapshot.val());
      return userDetails;
    } else {
      throw new Error("User not found!");
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllEvents = async () => {
  try {
    const snapshot = await get(ref(database, "events"));
    if (snapshot.exists()) {
      return Object.entries(snapshot.val());
    } else {
      throw new Error("Events not found!");
    }
  } catch (error) {
    console.log(error.message);
  }
}

export const getEventByEmail = async (email) => {
  try {
    const snapshot = await get(query(ref(database, "events"), orderByChild("author"), equalTo(email)));
    if (snapshot.exists()) {
      return Object.entries(snapshot.val());
    } else {
      throw new Error("Event not found!");
    }
  } catch (error) {
    console.log(error.message);
  }
};  

export const addUserToEvent = async (eventId, email) => {
    try {
      const eventRef = ref(database, `events/${eventId}`);
      const eventSnapshot = await get(eventRef);
      if (eventSnapshot.exists()) {
        const event = eventSnapshot.val();
        const invited = event.invited || [];
        if (!invited.includes(email)) {
          invited.push(email);
        }
        await update(eventRef, { invited });
      } else {
        throw new Error("Event not found!");
      }
    } catch (error) {
      console.log(error.message);
    }
};



/**
 * Edits a user's credential in the database.
 * @param {string} user - The user's username.
 * @param {string} credential - The name of the credential to be edited.
 * @param {string} newCredential - The new value for the credential.
 * @returns {Promise<string>} - A promise that resolves to the updated credential value or an error message.
 */
export const editCredential  = async (user, credential, newCredential) => {
  try {
    return await update(ref(database, `users/${user}`), { [credential]: newCredential });
  } catch (error) {
    return error.message;
  }
}