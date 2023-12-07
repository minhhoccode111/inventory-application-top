import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

// set an array of contacts to database
function set(contacts) {
  // setItem will return a new promise
  return localforage.setItem("contacts", contacts);
}

// get all contacts which match a query search user input
export async function getContacts(query) {
  // remember to use await because it's asynchronous
  // get an array of items named contacts if not existed then init an empty array
  let contacts = (await localforage.getItem("contacts")) || [];
  // if query search isn't empty
  if (query)
    // Takes an array of items and a value and returns a new array with the items that match the search query, we search keys in object and its priority
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last", "notes"],
    });
  // sort the result
  return contacts.sort(sortBy("last", "createdAt"));
}

// add new contact to the contacts array in database
export async function createContact() {
  // create a unique id
  let id = Math.random().toString(36).substring(2, 9);
  // init contact with unique id and a specific moment
  let contact = { id, createdAt: Date.now() };
  // get array data from database
  let contacts = await getContacts();
  // add new item to that array
  contacts.unshift(contact);
  // add that array back to database
  await set(contacts);
  // and return that contact
  return contact;
}

// find a contact base on its id and return, return null if not found
export async function getContact(id) {
  // get array data from database
  let contacts = await localforage.getItem("contacts");
  // find the contact with the id we need in the data
  let contact = contacts.find((contact) => contact.id === id);
  // then return it, null if not found
  return contact ?? null;
}

// update a contact base on its id, using Object.assign
export async function updateContact(id, updates) {
  // get data from database
  let contacts = await localforage.getItem("contacts");
  // find an object with given id
  let contact = contacts.find((contact) => contact.id === id);
  // if not found throw error
  if (!contact) throw new Error("No contact found for", id);
  // if found then update with Object.assign or {...contact, ...updates}
  Object.assign(contact, updates);
  // set back to database
  await set(contacts);
  // return that contact
  return contact;
}

// delete a contact from data array base on given id
export async function deleteContact(id) {
  // get data
  let contacts = await localforage.getItem("contacts");
  // find that contact base on given id
  let index = contacts.findIndex((contact) => contact.id === id);
  // if existed that splice that from array data and set database back
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    // return true to know it's success
    return true;
  }
  // false to know it's fail
  return false;
}
