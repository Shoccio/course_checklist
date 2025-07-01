import React, { useEffect, useState } from "react";
import Logo from "../imgs/uphsllogo.png";
import style from "../style/checklist.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 🔧 Helper function to add ordinal suffix to numbers (1 -> 1st, 2 -> 2nd, etc.)
function ordinal(n) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export default function Checklist() {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);

    const signOut = () => {
        navigate("/");
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
                <form>
                    <input className={style.searchBar} type="text" placeholder="SEARCH STUDENT..." />
                </form>

                <div className={style.studentDetail}>
                    <h3>STUDENT RESIDENCY EVALUATION</h3>
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

                    <h3>Curriculum Residency Evaluation</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>SUB CODE</th>
                                <th>SUB DESCRIPTION</th>
                                <th>TOTAL UNIT</th>
                                <th>CREDIT EARNED</th>
                                <th>GRADE</th>
                                <th>REMARK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>
                                        No courses found.
                                    </td>
                                </tr>
                            ) : (
                                (() => {
                                    const sorted = [...courses].sort((a, b) =>
                                        a.year !== b.year ? a.year - b.year : a.semester - b.semester
                                    );

                                    const rows = [];
                                    let prevYear = null;
                                    let prevSem = null;

                                    sorted.forEach((course, index) => {
                                        const { year, semester } = course;

                                        if (year !== prevYear || semester !== prevSem) {
                                            rows.push(
                                                <tr key={`label-${index}`} className={style.yearSem}>
                                                    <td colSpan="6" style={{ fontWeight: "bold" }}>
                                                        {ordinal(year)} Year, {ordinal(semester)} Sem
                                                    </td>
                                                </tr>
                                            );
                                            prevYear = year;
                                            prevSem = semester;
                                        }

                                        rows.push(
                                            <tr key={index}>
                                                <td>{course.course_id}</td>
                                                <td>{course.course_name}</td>
                                                <td>{course.course_units}</td>
                                                <td>{course.course_units}</td>
                                                <td>{course.grade ?? "-"}</td>
                                                <td>{course.remark}</td>
                                            </tr>
                                        );

                                    });

                                    return rows;
                                })()
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
