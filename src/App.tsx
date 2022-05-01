import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Upload from './components/Upload';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Upload />
    </div>
  );
}

export default App;
