import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/homepage';
import Main from './components/main';
import Shark from './components/shark';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/:username' element={<Main />} />
          <Route path='/sharkwatchfinals' element={<Shark />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
