import { Link } from "react-router-dom";
const Link2 = () => {
  return (
    <div>
      <header className="p-4 text-darker bg-cyan-100">
        <h1 className="text-4xl">This is Link2</h1>
      </header>
      <nav className="p-4 text-lg text-darker">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Link2;
