import React from "react";
import { Link } from "react-router-dom";

const Profile: React.FC = () => {
  return (
    <div>
      <h1>Hello from profile page!</h1>
      <p>So, how are you?</p>
      <nav>
        <ul>
          <li>
            <Link to="/">Home page</Link>
          </li>
          <li>
            <Link to="/user">User page</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Profile;
