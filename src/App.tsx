import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(1);
  }, []);

  return (
    <div>
      <h1 className="text-8xl font-extrabold">Hello, World!</h1>
      <h2>{count}</h2>
    </div>
  );
}

export default App;
