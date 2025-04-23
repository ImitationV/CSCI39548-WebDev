import { useState } from 'react';
import './App.css';

function App() {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']; // Example colors
  const [colorIndex, setColorIndex] = useState(0);
  const currentColor = colors[colorIndex];

  const handleClick = () => {
    setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
  };

  return (
    <div className="app" style={{ backgroundColor: currentColor }}>
      <button onClick={handleClick}>Change Color</button>
    </div>
  );
}

export default App;