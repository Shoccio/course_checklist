import React, { useEffect, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import style from "../style/checklist.module.css";

import StudentSearchBar from "../component/searchBar";
import CourseTable from "../component/student_table";
import AddStudent from "../component/addStudent";
import EditStudent from "../component/editStudent";
import HeaderWebsite from "../component/header";

import { useUser, useCourses, useFetchStudentInfo } from "../App";

export default function Dashbaord() {
    const pageName = "DASHBOARD";
    const navigate = useNavigate();
    const fetchStudentData = useFetchStudentInfo()

    const [currentUser, setCurrentUser] = useUser();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [courses, setCourses] = useCourses()
    const [isViewing, setIsViewing] = useState(false);

    const addStudent = async (student) => {
        try {
            await axios.post("http://127.0.0.1:8000/student/add", student, { withCredentials: true });
            handleStudentSelect(student.student_id);
        } catch (err) {
            console.error("Adding failed:", err);
        }
    };

    const editStudent = async (student) => {
        try {
            await axios.put(
                `http://127.0.0.1:8000/student/edit`,
                student,
                { withCredentials: true }
            );
            handleStudentSelect(student.id);
        } catch (err) {
            console.error("Editing failed:", err);
        }
    };

    const handleStudentSelect = async (student_id) => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/student/get/${student_id}`, {
                withCredentials: true,
            });
            setSelectedStudent(res.data.student);
            setCourses(res.data.courses);
            setIsViewing(true);
        } catch (err) {
            console.error("Failed to fetch student details: ", err);
        }
    };

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("currentUser"));
        setCurrentUser(user);

        const courses = JSON.parse(sessionStorage.getItem("courses"));
        setCourses(courses);
    }, []);

    return (
        <div className={style.curChecklist}>
            <HeaderWebsite pageName={pageName} />

            <div className={style.studentBody}>
                <img src="https://images.klipfolio.com/website/public/bf9c6fbb-06bf-4f1d-88a7-d02b70902bd1/data-dashboard.png" style={{width: "60%", margin: "auto"}}></img>
            </div>
        </div>
    );
}
