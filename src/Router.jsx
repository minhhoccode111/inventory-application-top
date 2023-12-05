import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";

const Router = () => {
  // create router configuration
  const router = createBrowserRouter([
    {
      // root element is home with many
      path: "/",
      element: <Root />,
      // Error Page to handle not found
      errorElement: <ErrorPage />,
      // loader to provide data to the route element before it renders, in the case will return a object with contacts array and a search query
      loader: rootLoader,
      // action is used to write the data for loader to read, and provide a way for apps to perform data mutations with simple HTML and HTTP semantics while React Router abstracts away the complexity of asynchronous UI and revalidation
      // Actions are called whenever the app sends a non-get submission("post", "put", "patch", "delete") to your route
      action: rootAction,
      children: [
        {
          // if child not found
          errorElement: <ErrorPage />,
          children: [
            {
              // default child
              index: true,
              element: <Index />,
            },
            {
              // dynamic segments using contact's id,
              path: "contacts/:contactId",
              element: <Contact />,
              // data will be loaded to use when render contact
              loader: contactLoader,
              // action will be used to handle adding or removing favorite contact
              action: contactAction,
            },
            {
              // edit a contact
              path: "contacts/:contactId/edit",
              // display edit contact element base on contact's id which be loaded by loader
              element: <EditContact />,
              // loader to load data
              loader: contactLoader,
              // action to update data when edit form submit
              action: editAction,
            },
            {
              // a form submit will take us to /destroy which will call 'action' to destroy a contact in contact database base on its contact id on the URL
              path: "contacts/:contactId/destroy",
              // destroy contact
              action: destroyAction,
              // if something weird occur
              errorElement: <div>Oops! There was an error.</div>,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
