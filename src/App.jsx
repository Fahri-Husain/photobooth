import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import ChooseLayout from './pages/ChooseLayout';
import PhotoEditor from './pages/PhotoEditor';
import { AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/choose-layout" element={<ChooseLayout />} />
              <Route path="/edit/:layoutId" element={<PhotoEditor />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
