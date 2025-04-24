import { useState } from 'react';
import './App.css';

function App() {
  const colors = ['#0F2C67', '#CD1818', '#F3950D', '#F4E185', '#ACC572']; 
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