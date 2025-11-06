import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { createContext, useContext, useState } from "react";
import Login from "./pages/login"
import Checklist from "./pages/checklist"
import ProgramCourseList from "./pages/program_course_list";
import './App.css';
import axios from "axios";

const UserContext = createContext(null)
const CoursesContext = createContext(null)
const fetchStudentInfo = createContext(null)
const ProgramFunc = createContext(null)


function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [courses, setCourses] = useState([]);

  const programGet = async () => {
    try {
      const progrms = await axios.get("http://127.0.0.1:8000/program/get");

      const programsMap = {};
      progrms.data.forEach((p) => {
        programsMap[p] = p;
      });

      //setPrograms(programsMap);

      return progrms.data;

    } catch (err) {
      console.error("Getting programs failed: ", err);
    }
  }; 

  const fetchCurrentStudent = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/student/get/details", { withCredentials: true })

      return res.data;
    } catch (err) {
      console.error("Failed to fetch student data: ", err);
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

    const data = await fetchCurrentStudent();
    sessionStorage.setItem("currentUser", JSON.stringify(data.student));
    setCurrentUser(data.student);
    if(currentUser?.role === "student"){
      setCourses(data.courses);
      sessionStorage.setItem("courses", JSON.stringify(data.courses));
    }
    
    return response.status === 200;

  };
  return (
    <ProgramFunc.Provider value={programGet}>
      <UserContext.Provider value={[currentUser, setCurrentUser]}>
        <CoursesContext.Provider value={[courses, setCourses]}>
          <fetchStudentInfo.Provider value={fetchCurrentStudent}>
            <Router>
              <Routes>
                <Route path="/" element={<Login checkCredential={checkCredential}/>} />
                <Route path="/checklist" element={<Checklist />} />
                <Route path="/program-checklist" element={<ProgramCourseList />} />
              </Routes>
            </Router>
          </fetchStudentInfo.Provider>
        </CoursesContext.Provider>
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

export function useCourses(){
  return useContext(CoursesContext)
}

export function useFetchStudentInfo(){
  return useContext(fetchStudentInfo)
}

export default App;
