import { Link } from "react-router-dom";

const ErrorElement = () => {
  return (
    <div className="p-4">
      <h1 className="text-center text-red text-4xl">Error not Found</h1>
      <Link
        to="/"
        className="text-xl text-darker underline decoration-dotted hover:decoration-solid hover:opacity-80"
      >
        Back to Homepage
      </Link>
    </div>
  );
};
export default ErrorElement;
