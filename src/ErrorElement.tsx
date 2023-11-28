import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div>
      <h1 className="text-8xl">404</h1>
      <p>
        Page not found you son of a stupid bitch, what are you trying to do?
      </p>
      <Link to="/">Go fucking back right now!</Link>
    </div>
  );
};
export default ErrorPage;
