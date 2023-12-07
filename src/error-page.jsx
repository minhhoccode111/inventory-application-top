import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  // this error page is used in errorElement property
  // and this hook returns anything thrown during an action, loader, or rendering
  const error = useRouteError();
  console.log(error);
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {/* we display the statusText or message of the error */}
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};
export default ErrorPage;
