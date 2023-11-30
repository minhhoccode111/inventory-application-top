import { Link } from "react-router-dom";

const App = () => {
  return (
    <div className="">
      <header className="p-4 bg-cyan-100 text-darker border-b flex items-center justify-between gap-4">
        <h1 className="text-4xl">Page Title</h1>
        <ul className="flex text-xl items-center justify-center gap-4">
          <li className="underline opacity-80 transition-colors hover:opacity-100 decoration-dotted hover:decoration-solid">
            <Link to="/link0">Link0</Link>
          </li>
          <li className="underline opacity-80 transition-colors hover:opacity-100 decoration-dotted hover:decoration-solid">
            <Link to="/link1">Link1</Link>
          </li>
          <li className="underline opacity-80 transition-colors hover:opacity-100 decoration-dotted hover:decoration-solid">
            <Link to="/link2">Link2</Link>
          </li>
          <li className="underline opacity-80 transition-colors hover:opacity-100 decoration-dotted hover:decoration-solid">
            <Link to="/link3">Link3</Link>
          </li>
        </ul>
      </header>
      <nav className="p-4 text-lg text-darker">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <hr />
    </div>
  );
};
export default App;
