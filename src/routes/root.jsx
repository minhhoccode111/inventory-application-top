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
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
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
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span> ⭐</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
};

export default Root;
