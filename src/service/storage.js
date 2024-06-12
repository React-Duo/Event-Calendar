import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import{ storage } from "../config/firebase-config.js"

/**
 * Uploads a file to the storage.
 * @param {string} username - The username of the user.
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<void>} - A promise that resolves when the file is uploaded successfully.
 */
export const uploadFile = async (username, file) => {
    const imageNameRef = ref(storage, `users/${username}/photo`);
    await uploadBytes(imageNameRef, file)
  };
  
/**
 * Retrieves the URL of a file associated with a user's photo.
 *
 * @param {string} username - The username of the user.
 * @returns {Promise<string>} The URL of the user's photo.
 */
export const getFile = async (username) => {
  try {
    const imageRef = ref(storage, `users/${username}/photo`);
    const url = await getDownloadURL(imageRef)
    return url;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Uploads an event image to the specified path in the storage.
 * @param {string} path - The path where the image will be uploaded.
 * @param {Blob} image - The image file to be uploaded.
 * @returns {Promise<void>} - A promise that resolves when the image is successfully uploaded.
 */
export const uploadEventImage = async (path, image) => {
  try {
    await uploadBytes(ref(storage, `events/${path}/photo`), image);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves the download URL of an image from the specified path.
 * @param {string} path - The path of the image.
 * @returns {Promise<string>} - A promise that resolves to the download URL of the image.
 */
export const getImageURL = async (path) => {
  try {
    return await getDownloadURL(ref(storage, `events/${path}/photo`))
  } catch (error) {
    console.log(error);
  }
}