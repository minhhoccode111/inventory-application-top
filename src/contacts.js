import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

/**
 * Retrieves contacts based on a given query.
 *
 * @param {string} query - The search query for filtering the contacts.
 * @return {Array} - An array of contacts sorted by last name and creation date.
 */
export async function getContacts(query) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem("contacts");
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

/**
 * Creates a new contact.
 *
 * @return {Object} The newly created contact.
 */
export async function createContact() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  console.log(id);
  let contact = { id, createdAt: Date.now() };
  let contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

/**
 * Retrieves a contact from the local database based on the provided ID.
 *
 * @param {number} id - The ID of the contact to retrieve.
 * @return {Object | null} The contact object if found, or null if not found.
 */
export async function getContact(id) {
  await fakeNetwork(`contact:${id}`);
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find((contact) => contact.id === id);
  return contact ?? null;
}

/**
 * Updates a contact in the contacts list.
 *
 * @param {string} id - The ID of the contact to be updated.
 * @param {object} updates - The updates to be applied to the contact.
 * @return {object} The updated contact.
 */
export async function updateContact(id, updates) {
  await fakeNetwork();
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find((contact) => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

/**
 * Deletes a contact in the contacts list base on its ID
 *
 * @param {string} id
 * @returns {boolean} result of the delete process
 */
export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

/**
 * Sets the contacts in local storage.
 *
 * @param {any} contacts - The contacts to set.
 * @return {Promise} - A promise that resolves when the contacts are set.
 */
function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

/**
 * A function that simulates a network request.
 *
 * @param {string} key - The key used to identify the request.
 * @return {Promise} A promise that resolves after a random delay.
 */
async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, 0);
  });
}
