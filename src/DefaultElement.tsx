import { Link } from "react-router-dom";

const DefaultElement = () => {
  return (
    <div>
      <nav className="p-4 text-lg text-darker">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <header className="p-4 text-4xl text-darker bg-cyan-100">
        <h1>This is Default page content</h1>
      </header>
      <hr />
    </div>
  );
};
export default DefaultElement;
