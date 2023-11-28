import { Link, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <h1 className="text-8xl">404</h1>
      <p>
        Page not found you son of a stupid bitch, what are you trying to do?
      </p>
      <Link to="/">Go fucking back right now!</Link>
      <button className="text-blue text-2xl cursor-pointer" onClick={goBack}>
        Go back
      </button>
    </div>
  );
};
export default ErrorPage;
