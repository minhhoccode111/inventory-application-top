import { Link } from "react-router-dom";
const App = () => {
  return (
    <div>
      <h1>Hello from the main page of the app!</h1>
      <p>Here are some examples of links to other pages</p>
      <nav>
        <ul>
          <li className="text-blue font-sans text-2xl">
            <Link to="profile">Profile page</Link>
          </li>
          <li className="text-blue font-sans text-2xl">
            <Link to="profile/popeye">Popeye page</Link>
          </li>
          <li className="text-blue font-sans text-2xl">
            <Link to="profile/spinach">Spinach page</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default App;
