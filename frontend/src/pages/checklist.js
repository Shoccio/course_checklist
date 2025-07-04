import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaPlus, FaPrint } from "react-icons/fa"; // pencil icon
import style from "../style/checklist.module.css";
import StudentSearchBar from "../component/searchBar";
import CourseTable from "../component/student_table";
import AddStudent from "../component/addStudent";
import EditStudent from "../component/editStudent";
import HeaderWebsite from "../component/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checklist() {
    let pageName = "CURRICULUM CHECKLIST"
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isViewing, setIsViewing] = useState(false);

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

            handleStudentSelect(student.student_id)
        }
        catch (err){
            console.error("Adding failed: ", err);
        }
    }

    const editStudent = async (student, old_id) => {
        try {
            await axios.put(`http://127.0.0.1:8000/student/edit/${old_id}`,
                student ,
                { withCredentials: true }
            );

            handleStudentSelect(student.student_id)
        }
        catch (err){
            console.error("Editing failed: ", err);
        }
    }

    const handleStudentSelect = async (student_id) =>{
        try {
            const res = await axios.get(`http://127.0.0.1:8000/student/get/${student_id}`, {
                withCredentials: true
            });
            setStudent(res.data.student);
            setCourses(res.data.courses);
            setIsViewing(true);
        } catch (err) {
            console.error("Failed to fetch student details: ", err);
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
            console.error("Failed to fetch student data: ", err);
            if (err.response?.status === 401) {
                navigate("/");
            }
        });
    }, []);

    return (
        <div className={style.curChecklist}>
            <HeaderWebsite pageName={pageName} logOut={signOut} />

            <div className={style.studentBody}>
                    {student?.role === "admin" && <StudentSearchBar onSelectStudent={handleStudentSelect} />}


                <div className={style.studentDetail}>
                    <h3>
                        STUDENT RESIDENCY EVALUATION
                        <span className={style.buttons}>
                            <AddStudent onSubmit={addStudent} />
                            <EditStudent onSubmit={editStudent} student={student} isViewing={isViewing} />
                            <FaPrint style={{cursor: "pointer"}}
                                     title="Print"/>
                        </span>

                    </h3>
                    
                    <div className={style.studentResidency}>
                        <div className={style.lBlock}>
                            <span>Student ID: {student?.student_id}</span>
                            <span>Student Name: {student?.student_l_name}, {student?.student_f_name}</span>
                            <span>Program/Major: {student?.program}</span>
                            <span>Total Units Required for this Course: {student?.total_units_required}</span>
                        </div>
                        <div className={style.rBlock}>
                            <span>Year: {student?.student_year}</span>
                            <span>Status: {student?.student_status}</span>
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
