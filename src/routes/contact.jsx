import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

// this will be called before the component is render to prepare data, which can be access through useLoaderData
export async function loader({ params }) {
  // we get contact by access params.contactID which is dynamically created when we navigate to new link
  const contact = await getContact(params.contactId);
  // if the contact is not found then we throw error
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  // else we return like this to easily extract data using useLoaderData
  return { contact };
}

// this action is only used to handle toggle favorite form submit action
export async function action({ request, params }) {
  // we can extract form's data like this with the requests parameter property of the object argument been passed in
  let formData = await request.formData();
  // then we update that contact in database
  return updateContact(params.contactId, {
    // update base on form's data of favorite element, updateContact function will return the updated contact item itself
    favorite: formData.get("favorite") === "true",
  });
}

// a Favorite component which take a contact item to display a small toggle favorite form section
function Favorite({ contact }) {
  // useFetcher hook lets you plug your UI into your actions and loaders without navigating, mean you can call loader or action using this hook
  const fetcher = useFetcher();
  // we extract favorite data
  let favorite = contact.favorite;
  // the fetcher knows the form data being submitted to the action, so it's available to you on fetcher.formData. We'll use that immediately update the star's state, even though the network hasn't finished. If the update eventually fails, the UI will revert to the real data
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  return (
    <>
      {/* fetcher.Form is just like <Form> except it doesn't cause a navigation */}
      {/* the method attribute specifies how to spend form-data (the form-data is sent to the page specified in the action attribute) */}
      {/* the form-data can be sent as URL variables (with method='get') or as HTTP post transaction (with method='post') */}
      {/* so in this case method='post' is used so that it doesn't change the URL */}
      <fetcher.Form method="post">
        <button
          name="favorite"
          value={favorite ? "false" : "true"}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          {/* toggle between these two */}
          {favorite ? "★" : "☆"}
        </button>
      </fetcher.Form>
    </>
  );
}

// contact component
export default function Contact() {
  // extract data from loader returned value
  const { contact } = useLoaderData();
  return (
    // display a contact base on its value
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || null} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          {/* favorite is a fetcher.Form which can be used to change favorite data in database */}
          <Favorite contact={contact} />
        </h1>

        {/* display twitter */}
        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {/* if this not empty the display it */}
        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            {/* a form for edit which will take us to a dynamic created URL */}
            {/* where everything will be listen to navigate back (when cancel) or call action (when submit change), etc. */}
            <button type="submit">Edit</button>
          </Form>
          <Form
            // this form submit will prompt a confirm and then navigate us to /destroy URL where its action will be called before that to delete the contact item and then navigate us back to the root
            // so this means typically we can delete a contact item by adding /destroy to its URL
            method="post"
            action="destroy"
            onSubmit={(e) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                e.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
