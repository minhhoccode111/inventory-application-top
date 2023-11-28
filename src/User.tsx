import { Link } from "react-router-dom";
const User = () => {
  return (
    <div>
      <h1>Hello, world!</h1>;<p>So, you are still well</p>
      <p>Here are some examples of links to other pages</p>
      <nav>
        <ul>
          <li>
            <Link to="/">Home page</Link>
          </li>
          <li>
            <Link to="/profile">Profile page</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default User;
