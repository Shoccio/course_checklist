import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from "./pages/login"
import Checklist from "./pages/checklist"
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/checklist" element={<Checklist />} />
      </Routes>
    </Router>
  );
}

export default App;
