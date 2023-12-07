import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../contacts";

// this action will be call when edit form submits
export async function action({ request, params }) {
  // we can extract data from its through request property
  let formData = await request.formData();
  // the we make an object base on changes user have made
  const updates = Object.fromEntries(formData);
  // and pass to updateContact function to modify database
  await updateContact(params.contactId, updates);
  // then redirect back to current contact we are modify
  return redirect(`/contacts/${params.contactId}`);
}

// this component will display a form for user to edit and submit, if user cancel then we will navigate(-1) mean back to the route before, else user submit then the action will be called and contact item will be update in database, user can actually navigate to this edit section by adding /edit after the contact item's URL
export default function EditContact() {
  // extract data from loader, this edit Component is being used the same loader as Contact component to load the contact item itself, so that we don't need to write another loader
  const { contact } = useLoaderData();
  // can be used to navigate back 1 level if user cancel the edit section
  const navigate = useNavigate();

  return (
    // form submit will call action to run to update base on this URL contactId
    <Form method="post" id="contact-form">
      {/* inputs to collect data to edit with default value  */}
      <p>
        <span>Name</span>
        <input
          type="text"
          name="first"
          aria-label="First name"
          placeholder="First"
          defaultValue={contact.first}
        />
        <input
          type="text"
          name="last"
          aria-label="Last name"
          placeholder="Last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          type="text"
          aria-label="Avatar URL"
          name="avatar"
          defaultValue={contact.avatar}
          placeholder="https://example.com/avatar.jpg"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6}></textarea>
      </label>
      <p>
        {/* submit to save and cancel to navigate back */}
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}
