import React, { useState } from "react";
import { FaPencilAlt } from "react-icons/fa"; // pencil icon
import style from "../style/table.module.css"; // adjust if needed

// 🔧 Helper function to add ordinal suffix to numbers (1 -> 1st, 2 -> 2nd, etc.)
function ordinal(n) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export default function CourseTable({ courses, role }) {
    const [editIndex, setEditIndex] = useState(null);
    const [editedGrade, setEditedGrade] = useState("");
    const [editedRemark, setEditedRemark] = useState("");

    const handleEditClick = (index, grade, remark) => {
        setEditIndex(index);
        setEditedGrade(grade ?? "");
        setEditedRemark(remark ?? "Passed");
    };

    const handleSave = () => {
        // Handle saving here
        console.log("Saving grade:", editedGrade, "remark:", editedRemark);
        setEditIndex(null);
    };

    return (
        <>
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Curriculum Residency Evaluation
                
            </h3>

            <table>
                <thead>
                    <tr>
                        <th>SUB CODE</th>
                        <th>SUB DESCRIPTION</th>
                        <th>TOTAL UNIT</th>
                        <th>CREDIT EARNED</th>
                        <th>GRADE</th>
                        <th>REMARK</th>
                        {role && role === "admin" && <th>&nbsp;</th>}
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

                                const isEditing = editIndex === index;

                                rows.push(
                                    <tr key={index}>
                                        <td>{course.course_id}</td>
                                        <td>{course.course_name}</td>
                                        <td>{course.course_units}</td>
                                        <td>{course.grade === null ? "-" : course.course_units}</td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedGrade}
                                                    onChange={(e) => setEditedGrade(e.target.value)}
                                                />
                                            ) : (
                                                course.grade ?? "-"
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <select
                                                    value={editedRemark}
                                                    onChange={(e) => setEditedRemark(e.target.value)}
                                                >
                                                    <option value="Passed">Passed</option>
                                                    <option value="Incomplete">Incomplete</option>
                                                    <option value="Failed">Failed</option>
                                                </select>
                                            ) : (
                                                course.remark
                                            )}
                                        </td>
                                        {isEditing && (
                                            <td>
                                                <button onClick={handleSave}>Save</button>
                                            </td>
                                        )}
                                        {!isEditing && role && role === "admin" && (
                                            <td>
                                                <FaPencilAlt
                                                    style={{ cursor: "pointer" }}
                                                    title="Edit row"
                                                    onClick={() =>
                                                        handleEditClick(index, course.grade, course.remark)
                                                    }
                                                />
                                            </td>
                                        )}
                                    </tr>
                                );
                            });

                            return rows;
                        })()
                    )}
                </tbody>
            </table>
        </>
    );
}
