import { database } from '../config/firebase-config.js';
import { ref, get, set, update, query, equalTo, orderByChild, push } from "firebase/database";
import { onValue } from "firebase/database";
import { getImageURL, uploadEventImage } from './storage.js';
import { DEFAULT_EVENT_IMAGE } from "../common/constants.js";

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
    let seriesId = '';
    let photo = '';
    await Promise.all(events.map(async (event, index) => {
        const response = await push(ref(database, 'events'), event);
        const eventId = response._path.pieces_[1];
        if (index === 0) seriesId = eventId;

        if (event.photo !== DEFAULT_EVENT_IMAGE) {
          await uploadEventImage(seriesId, event.photo);
          photo = await getImageURL(seriesId);
        } else {
          photo = event.photo;
        }
        
        if (index === 0) await update(ref(database, `events/${eventId}`), { id: eventId, photo })

        if (index !== 0) { 
            if (event.repeat !== 'single') await update(ref(database, `events/${eventId}`), { id: eventId, seriesId, photo })
            if (event.repeat === 'single') await update(ref(database, `events/${eventId}`), { id: eventId, photo });
        }
    }));
  } catch (error) {
    console.log(error.message);
  }
}

export const updateEvent = async (event) => {
  try {
    const { title, description, invited, locationType, location, visibility, canInvite, photo } = event;
    if (event.repeat !== "single") {
      const snapshot = await get(query(ref(database, "events"), orderByChild("seriesId"), equalTo(event.id)));
      if (snapshot.exists()) {
        const eventsToUpdate = snapshot.val();
        eventsToUpdate[event.id] = event;
        Object.values(eventsToUpdate).map(async (eventToUpdate) => {
          await update(ref(database, `events/${eventToUpdate.id}`), { title, description, invited, locationType, location, visibility, canInvite, photo });
        });
      } else {
        throw new Error("Event not found!");
      }
    } else {
      return await update(ref(database, `events/${event.id}`), { title, description, invited, locationType, location, visibility, canInvite, photo });
    }
  } catch (error) {
    console.log(error.message);
  }
}

export const getEventById = async (eventId) => {
  try {
    const snapshot = await get(ref(database, `events/${eventId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("Event not found!");
    }
  } catch (error) {
    console.log(error.message);
  }
}

export const deleteEvent = async (eventId, flag) => {
    try {
      if (flag === 'single') {
        return await set(ref(database, `events/${eventId}`), null);
      }

      if (flag === 'series') {
        const snapshot = await get(query(ref(database, "events"), orderByChild("seriesId"), equalTo(eventId)));
        if (snapshot.exists()) {
          const eventsToDelete = snapshot.val();
          eventsToDelete[eventId] = null;
          Object.keys(eventsToDelete).map(async (eventId) => {
            await set(ref(database, `events/${eventId}`), null);
          });
        } else {
          throw new Error("Event not found!");
        }
      }
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

/**
 * Searches for a user in the database based on the provided search string and search term.
 * @param {string} searchString - The string to search for.
 * @param {string} searchTerm - The term to search for (e.g., "name", "email").
 * @returns {Promise<any>} - A promise that resolves to the user data if found, or throws an error if not found.
 */
export const searchUser = async (searchString, searchTerm) => {
  try {
    const snapshot = await get(query(ref(database, "users"), orderByChild(searchTerm), equalTo(searchString)));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("User not found!");
    }
  } catch (error) {
    console.log(error.message);
  }
}

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

export const getChatMessages = async (listId) => {
  try {
    const snapshot = await get(ref(database, `contactLists/${listId}/messages`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("Messages not found!");
    }
  } catch (error) {
    console.log(error.message);
  }
}


export const updateMessages = async (listId, message) => {
  try {
    return await set(ref(database, `contactLists/${listId}/messages`), message);
  } catch (error) {
    console.log(error.message);
  }
}

export const listenForChatMessages = (listId, callback) => {
  const messagesRef = ref(database, `contactLists/${listId}/messages`);
  onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const messagesObject = snapshot.val();
      const messagesArray = Object.keys(messagesObject).map(key => messagesObject[key]);
      callback(messagesArray);
    } else {
      callback([]);
    }
  }, (error) => {
    console.log(error.message);
  });
}

export const getPublicEvents = async () => {
  try {
    const snapshot = await get(query(ref(database, "events"), orderByChild("visibility"), equalTo("public")));
    if (snapshot.exists()) {
      return Object.entries(snapshot.val());
    } else {
      throw new Error("Events not found!");
    }
  } catch (error) {
    console.log(error.message);
  }
};