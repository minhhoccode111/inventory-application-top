import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ErrorElement from "./ErrorElement";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorElement />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
