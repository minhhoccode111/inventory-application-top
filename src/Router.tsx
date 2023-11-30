import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Link0 from "./Link0";
import Link1 from "./Link1";
import Link2 from "./Link2";
import Link3 from "./Link3";
import ErrorElement from "./ErrorElement";
import DefaultElement from "./DefaultElement";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorElement />,
      children: [
        {
          index: true,
          element: <DefaultElement />,
        },
        {
          path: "link0",
          element: <Link0 />,
        },
        {
          path: "link1",
          element: <Link1 />,
        },
        {
          path: "link2",
          element: <Link2 />,
        },
        {
          path: "link3",
          element: <Link3 />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
