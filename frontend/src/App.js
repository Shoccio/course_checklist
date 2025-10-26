import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { createContext, useContext, useState } from "react";
import Login from "./pages/login"
import Checklist from "./pages/checklist"
import ProgramCourseList from "./pages/program_course_list";
import './App.css';
import axios from "axios";

const UserContext = createContext(null)
const ProgramFunc = createContext(null)


function App() {
  const [currentUser, setCurrentUser] = useState(null); // 👈 logged-in admin
  const [programs, setPrograms] = useState(null);

  const programGet = async () => {
  try {
    const progrms = await axios.get("http://127.0.0.1:8000/program/get");

    const programsMap = {};
    progrms.data.forEach((p) => {
      programsMap[p.program_id] = p;
    });

    setPrograms(programsMap);

    //return programsMap;

  } catch (err) {
    console.error("Getting programs failed: ", err);
  }
}; 

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

    programGet()

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
    <ProgramFunc.Provider value={programs}>
      <UserContext.Provider value={[currentUser, setCurrentUser]}>
        <Router>
          <Routes>
            <Route path="/" element={<Login checkCredential={checkCredential}/>} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/program-checklist" element={<ProgramCourseList />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </ProgramFunc.Provider>
  );
}

export function useUser(){
  return useContext(UserContext)
}

export function useGetProgram(){
  return useContext(ProgramFunc)
}

export default App;
