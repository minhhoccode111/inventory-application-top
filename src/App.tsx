import "./App.css";
import { Link } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello from the main page of the app!</h1>
      <p>Here are some examples of links to other pages</p>
      <nav>
        <ul>
          <li>
            <Link to="/profile">Profile page</Link>
          </li>
          <li>
            <Link to="/users">Users page</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default App;
