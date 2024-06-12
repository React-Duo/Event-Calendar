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

/**
 * Retrieves the contact lists owned by a user.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} - A promise that resolves to the contact lists owned by the user.
 * @throws {Error} - If the contact list is not found.
 */
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

/**
 * Adds events to the database.
 * @param {Array} events - An array of events to be added.
 * @returns {Promise<void>} - A promise that resolves when all events have been added.
 */
export const addEvent = async (events) => {
  try {
    let seriesId = '';
    let photo = '';
    return await Promise.all(events.map(async (event, index) => {
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
      return eventId;
    }));
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Updates an event in the database.
 * @param {Object} event - The event object to be updated.
 * @param {string} event.title - The title of the event.
 * @param {string} event.description - The description of the event.
 * @param {Array} event.invited - The list of invited participants.
 * @param {string} event.locationType - The type of location for the event.
 * @param {string} event.location - The location of the event.
 * @param {string} event.visibility - The visibility of the event.
 * @param {boolean} event.canInvite - Indicates whether participants can invite others.
 * @param {string} event.photo - The photo associated with the event.
 * @returns {Promise} A promise that resolves when the event is successfully updated.
 * @throws {Error} If the event is not found in the database.
 */
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
        return "Operation successful!";
      } else {
        throw new Error("Event not found!");
      }
    } else {
      await update(ref(database, `events/${event.id}`), { title, description, invited, locationType, location, visibility, canInvite, photo });
      return "Operation successful!";
    }
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Retrieves an event from the database by its ID.
 * @param {string} eventId - The ID of the event to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the event object if found, or throws an error if not found.
 */
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

/**
 * Deletes an event from the database.
 * @param {string} eventId - The ID of the event to be deleted.
 * @param {string} flag - The flag indicating whether to delete a single event or a series of events.
 * @returns {Promise<void>} - A promise that resolves when the event(s) is deleted.
 */
export const deleteEvent = async (eventId, flag) => {
    try {
      if (flag === 'single') {
        await set(ref(database, `events/${eventId}`), null);
        return "Operation successful!";
      }

      if (flag === 'series') {
        const snapshot = await get(query(ref(database, "events"), orderByChild("seriesId"), equalTo(eventId)));
        if (snapshot.exists()) {
          const eventsToDelete = snapshot.val();
          eventsToDelete[eventId] = null;
          Object.keys(eventsToDelete).map(async (eventId) => {
            await set(ref(database, `events/${eventId}`), null);
          });
          return "Operation successful!";
        } else {
          throw new Error("Event not found!");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
}

/**
 * Retrieves the users from the database.
 * @returns {Promise<Object>} A promise that resolves to the users data.
 * @throws {Error} If the users data is not found.
 */
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

/**
 * Retrieves the contact lists from the database.
 * @returns {Promise<Object>} A promise that resolves to the contact lists.
 * @throws {Error} If the contact lists are not found.
 */
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

/**
 * Adds a new list to the contactLists collection in the database.
 * @param {Object} listDetails - The details of the list to be added.(name, color, participants)
 * @returns {Promise} A promise that resolves with the result of the database operation.
 */
export const addList = async (listDetails) => {
  try {
    return await push(ref(database, 'contactLists'), listDetails);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Retrieves a contact list from the database by its ID.
 * @param {string} id - The ID of the contact list to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the contact list object if it exists, or throws an error if the list is not found.
 */
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

/**
 * Updates a contact list in the database.
 * @param {string} id - The ID of the contact list to update.
 * @param {Object} listDetails - The updated details of the contact list.
 * @returns {Promise} - A promise that resolves with the updated contact list.
 */
export const updateList = async (id, listDetails) => {
  try {
    return await update(ref(database, `contactLists/${id}`), listDetails);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Deletes a contact list from the database.
 * @param {string} id - The ID of the contact list to delete.
 * @returns {Promise<void>} - A promise that resolves when the contact list is deleted successfully.
 */
export const deleteList = async (id) => {
  try {
    return await set(ref(database, `contactLists/${id}`), null);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Retrieves user details from the database based on the provided email.
 * @param {string} email - The email of the user to retrieve details for.
 * @returns {Promise<Array>} - A promise that resolves to an array of user details.
 * @throws {Error} - If the user is not found in the database.
 */
export const getUserDetails = async (email) => {
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

/**
 * Retrieves all events from the database.
 * @returns {Promise<Array<[string, any]>>} An array of key-value pairs representing the events.
 * @throws {Error} If events are not found in the database.
 */
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

/**
 * Retrieves events from the database based on the provided email.
 *
 * @param {string} email - The email of the author to filter events by.
 * @returns {Promise<Array<[string, any]>>} - A promise that resolves to an array of key-value pairs representing the events found.
 * @throws {Error} - If no events are found for the provided email.
 */
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

/**
 * Adds a user to an event by updating the 'invited' array in the event object.
 * If the event does not exist, an error is thrown.
 *
 * @param {string} eventId - The ID of the event.
 * @param {string} email - The email of the user to be added.
 * @returns {Promise<void>} - A promise that resolves when the user is added to the event.
 */
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
export const editCredential = async (user, credential, newCredential) => {
  try {
    return await update(ref(database, `users/${user}`), { [credential]: newCredential });
  } catch (error) {
    return error.message;
  }
}

/**
 * Retrieves chat messages from the database for a given list ID.
 * @param {string} listId - The ID of the contact list.
 * @returns {Promise<Object>} - A promise that resolves to the chat messages object.
 * @throws {Error} - If the messages are not found.
 */
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

/**
 * Updates the messages for a specific contact list.
 *
 * @param {string} listId - The ID of the contact list.
 * @param {string} message - The message to be updated.
 * @returns {Promise} - A promise that resolves when the messages are updated successfully.
 */
export const updateMessages = async (listId, message) => {
  try {
    return await set(ref(database, `contactLists/${listId}/messages`), message);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Listens for chat messages in a specific contact list.
 * 
 * @param {string} listId - The ID of the contact list.
 * @param {function} callback - The callback function to be called when new messages are received.
 */
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

/**
 * Retrieves public events from the database.
 * @returns {Promise<Array<[string, any]>>} A promise that resolves to an array of key-value pairs representing the public events.
 * @throws {Error} If no public events are found.
 */
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