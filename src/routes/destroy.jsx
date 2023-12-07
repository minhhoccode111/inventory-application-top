import { deleteContact } from "../contacts";
import { redirect } from "react-router-dom";

// this action will be called to when /destroy URL is submitted to delete a contact item and navigate back to the root route
export async function action({ params }) {
  // throw new Error("oh dang!");
  await deleteContact(params.contactId);
  return redirect("/");
}
