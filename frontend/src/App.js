import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { useState } from "react";
import Login from "./pages/login"
import Checklist from "./pages/checklist"
import ProgramCourseList from "./pages/program_course_list";
import './App.css';
import axios from "axios";


function App() {
  const [currentUser, setCurrentUser] = useState(null); // 👈 logged-in admin

  const checkCredential = async (username, password) => {
    const response = await axios.post(
        'http://127.0.0.1:8000/auth/login',
        new URLSearchParams({
            username: username.trim(),
            password: password.trim()
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true
        }
    );

    console.log(response.data);

    axios
    .get("http://127.0.0.1:8000/student/get/details", { withCredentials: true })
    .then((res) => {
        setCurrentUser(res.data.student);
    })
    .catch((err) => {
        console.error("Failed to fetch student data: ", err);
    });
    
    return response.status === 200;

  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login checkCredential={checkCredential} setCurrentUser={setCurrentUser}/>} />
        <Route path="/checklist" element={<Checklist currentUser={currentUser} setCurrentUser={setCurrentUser}/>} />
        <Route path="/program-checklist" element={<ProgramCourseList />} />
      </Routes>
    </Router>
  );
}

export default App;
