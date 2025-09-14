import React, { useEffect, useState } from "react";
import { FaPrint } from "react-icons/fa";
import style from "../style/checklist.module.css";
import StudentSearchBar from "../component/searchBar";
import CourseTable from "../component/student_table";
import AddStudent from "../component/addStudent";
import EditStudent from "../component/editStudent";
import HeaderWebsite from "../component/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checklist({currentUser, setCurrentUser}) {
    const pageName = "CURRICULUM CHECKLIST";
    const navigate = useNavigate();

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isViewing, setIsViewing] = useState(false);

    const signOut = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/auth/logout", {}, { withCredentials: true });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            navigate("/");
        }
    };

    const addStudent = async (student) => {
        try {
            await axios.post("http://127.0.0.1:8000/student/add", { student }, { withCredentials: true });
            handleStudentSelect(student.student_id);
        } catch (err) {
            console.error("Adding failed:", err);
        }
    };

    const editStudent = async (student, old_id) => {
        try {
            await axios.put(
                `http://127.0.0.1:8000/student/edit/${old_id}`,
                student,
                { withCredentials: true }
            );
            handleStudentSelect(student.student_id);
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
            fetchStudentData(res.data.student);
            setIsViewing(true);
        } catch (err) {
            console.error("Failed to fetch student details: ", err);
        }
    };

    const fetchStudentData = async (user) => {
        const params = new URLSearchParams({
            student_id: user?.student_id,
            program_id: user?.program_id
        }).toString();
        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/SC/get?${params}`,
                { withCredentials: true }
            );

            setCourses(res.data);

        } catch (err) {
            console.error("Failed to fetch student data: ", err);
        }
    };


    // On initial mount — get the logged-in user and show them
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/student/get/details", {
                    withCredentials: true
                });
                setCurrentUser(res.data.student);
            } catch (err) {
                console.error("Failed to fetch current user: ", err);
                setCurrentUser(null);
                // optionally redirect to login
                // navigate("/");
            }
        };
        fetchCurrentUser();

        if(currentUser?.role === "student")
            fetchStudentData(currentUser);
    }, []);

    return (
        <div className={style.curChecklist}>
            <HeaderWebsite pageName={pageName} logOut={signOut} />

            <div className={style.studentBody}>
                <div className={style.studentSearchBarWrapper}>
                    {currentUser?.role === "admin" && (
                        <StudentSearchBar onSelectStudent={handleStudentSelect} />
                    )}
                </div>

                <div className={style.studentDetail}>
                    <h3>
                        STUDENT RESIDENCY EVALUATION
                        <span className={style.buttons}>
                            {currentUser?.role === "admin" && (
                                <>
                                    <AddStudent onSubmit={addStudent} />
                                    <EditStudent
                                        onSubmit={editStudent}
                                        student={selectedStudent}
                                        isViewing={isViewing}
                                    />
                                </>
                            )}
                            <FaPrint
                                style={{ cursor: "pointer" }}
                                title="Print"
                                onClick={() => window.print()}
                            />
                        </span>
                    </h3>

                    <div className={style.studentResidency}>
                        <div className={style.lBlock}>
                            <span>Student ID: {selectedStudent?.student_id}</span>
                            <span>Student Name: {selectedStudent?.student_l_name}, {selectedStudent?.student_f_name}</span>
                            <span>Program/Major: {selectedStudent?.program_id}</span>
                            <span>Total Units Required for this Course: {selectedStudent?.total_units_required}</span>
                        </div>
                        <div className={style.rBlock}>
                            <span>Year: {selectedStudent?.student_year}</span>
                            <span>Status: {selectedStudent?.student_status}</span>
                            <span>Total Units Taken: {selectedStudent?.units_taken}</span>
                            <span>GWA: {selectedStudent?.gwa}</span>
                        </div>
                    </div>

                    <CourseTable
                        student_id={selectedStudent?.student_id}
                        courses={courses}
                        role={currentUser?.role} // still pass the *logged-in user’s role*
                        onSelectStudent={handleStudentSelect}
                    />
                </div>
            </div>
        </div>
    );
}
