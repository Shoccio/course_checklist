import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaPlus, FaPrint } from "react-icons/fa"; // pencil icon
import Logo from "../imgs/uphsllogo.png";
import style from "../style/checklist.module.css";
import StudentSearchBar from "../component/searchBar";
import CourseTable from "../component/table";
import AddStudentModal from "../component/addStudent";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checklist() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);

    const signOut = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/auth/logout", {}, {
                withCredentials: true,
            });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            navigate("/");
        }
    };

    const addStudent = async (student) => {
        try {
            await axios.post("http://127.0.0.1:8000/student/add",
                { student: student },
                { withCredentials:true }
            )
        }
        catch (err){
            console.error("Adding failed:", err);
        }
    }

    const handleStudentSelect = async (student_id) =>{
        try {
            const res = await axios.get(`http://127.0.0.1:8000/student/get/${student_id}`, {
                withCredentials: true
            });
            setStudent(res.data.student);
            setCourses(res.data.courses);
        } catch (err) {
            console.error("Failed to fetch student details:", err);
        }
    };

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/student/get/details", {
            withCredentials: true,
        })
        .then((res) => {
            setStudent(res.data.student);
            setCourses(res.data.courses);
        })
        .catch((err) => {
            console.error("Failed to fetch student data:", err);
            if (err.response?.status === 401) {
                navigate("/");
            }
        });
    }, []);

    return (
        <div className={style.curChecklist}>
            <header>
                <div className={style.logo}>
                    <img src={Logo} alt="Logo" width="100" height="100" />
                    <b>UNIVERSITY OF PERPETUAL HELP SYSTEM LAGUNA</b>
                </div>
                <button className={style.signOut} type="button" onClick={signOut}>
                    SIGN OUT
                </button>
                <div className={style.banner}>CURRICULUM CHECKLIST</div>
            </header>

            <div className={style.studentBody}>
                    {student?.role === "admin" && <StudentSearchBar onSelectStudent={handleStudentSelect} />}


                <div className={style.studentDetail}>
                    <h3>
                        STUDENT RESIDENCY EVALUATION
                        <span className={style.buttons}>
                            <AddStudentModal onSubmit={addStudent} />
                            <FaPencilAlt style={{cursor: "pointer"}}
                                         title="Edit Student"/>
                            <FaPrint style={{cursor: "pointer"}}
                                     title="Print"/>
                        </span>

                    </h3>
                    
                    <div className={style.studentResidency}>
                        <div className={style.lBlock}>
                            <span>Student ID: {student?.student_id}</span>
                            <span>Student Name: {student?.name}</span>
                            <span>Program/Major: {student?.program}</span>
                            <span>Total Units Required for this Course: {student?.total_units_required}</span>
                        </div>
                        <div className={style.rBlock}>
                            <span>Year: {student?.year}</span>
                            <span>Status: {student?.status}</span>
                            <span>Total Units Taken: {student?.units_taken}</span>
                            <span>GWA: {student?.gwa}</span>
                        </div>
                    </div>

                    <CourseTable student_id={student?.student_id}
                    courses={courses} role={student?.role} onSelectStudent={handleStudentSelect} />

                </div>
            </div>
        </div>
    );
}
