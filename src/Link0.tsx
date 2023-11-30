import { Link } from "react-router-dom";
const Link0 = () => {
  return (
    <div>
      <nav className="p-4 text-lg text-darker">
        <Link to="/">Home &gt; </Link>

        <Link to="/link0">Link0 &gt; </Link>
      </nav>
      <hr />
      <header className="p-4 text-darker bg-cyan-100">
        <h1 className="text-4xl">This is Link0 content</h1>
      </header>
      <hr />
    </div>
  );
};
export default Link0;
