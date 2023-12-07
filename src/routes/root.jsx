import {
  Outlet,
  useNavigation,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useSubmit,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";

// this will be called before the component is render to prepare data, which can be accessed using `useLoaderData`
// loader will be called with an object has 2 properties: request, params
export async function loader({ request }) {
  // create a URL object with URL constructor
  const url = new URL(request.url);
  // then we can access its search query params
  const q = url.searchParams.get("q");
  // or we can write const q = new URL(request.url).searchParams.get('q')
  // the we search in database if something match that search
  const contacts = await getContacts(q);
  // return an object which can be accessed using useLoaderData and destructuring data easily
  return { contacts, q };
}

// this will be called when the form do something with the URL
export async function action() {
  // so we create new contact
  const contact = await createContact();
  // and redirect to that newly created contact id URL
  return redirect(`/contacts/${contact.id}`);
}

// root element which always existed as a side bar, the dynamic segment part will be in the middle of the page
const Root = () => {
  // extract data which was prepared by loader
  const { contacts, q } = useLoaderData();
  //
  const navigation = useNavigation();
  console.log(navigation);
  // this submit variable now can be called to act as form submit
  const submit = useSubmit();
  // if location isn't undefined and we are searching, then searching will be true and can be used to add some style to the app
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  useEffect(() => {
    // make the input to match to search URL after we navigate to new URL
    document.getElementById("q").value = q;
  }, [q]);
  return (
    <>
      {/* side bar always exists to navigation between items */}
      <div id="sidebar">
        {/* header */}
        <h1>React Router Contacts</h1>
        {/* fake form to do the searching and adding new item */}
        <div>
          {/* role search is used to identify the search functionality; as a accessibility way */}
          <Form id="search-form" role="search">
            {/* a search input */}
            <input
              type="search"
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              name="q"
              defaultValue={q}
              onChange={(e) => {
                const isFirstSearch = q == null;
                submit(e.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            {/* display a spinner base on weather we are loading */}
            <div id="search-spinner" aria-hidden hidden={!searching} />
            {/* tell user this is going to change */}
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            {/* a button to submit form which will automatically create a new item in side bar */}
            <button type="submit">New</button>
          </Form>
        </div>
        {/* display all items to be a clickable link */}
        <nav>
          {/* if contacts is not empty */}
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                // a li contain a link
                <li key={contact.id}>
                  {/* each link is a nav link Component, <NavLink> is a special kind of <Link> that knows weather or not it is 'active', 'pending', 'transitioning'. This is useful in scenarios when in a navbar and we want to know which of them is currently selected */}
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {/* if first name or last name not empty */}
                    {contact.first || contact.last ? (
                      <>
                        {/* then we display first and last name */}
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      // else it's no name
                      <i>No Name</i>
                    )}{" "}
                    {/* base on favorite to display a star next to the name */}
                    {contact.favorite && <span> ⭐</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              {/* if navbar is currently empty then display this */}
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      {/* this is used to display main content of every item */}
      <div
        id="detail"
        // in case of poor internet connection, the loading class will make this section fade with opacity 0.25
        className={navigation.state === "loading" ? "loading" : ""}
      >
        {/* Outlet is dynamic segment */}
        <Outlet />
      </div>
    </>
  );
};

export default Root;
