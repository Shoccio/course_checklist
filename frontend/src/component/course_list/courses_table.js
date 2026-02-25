import React from "react";
import style from "../../style/table.module.css";

export default function CoursesTable({ courses }) {
    return (
        <>
            <div className={style.tableHeader}>
                <h3>Courses</h3>
            </div>

            <table className={style.tble}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Year</th>
                        <th>Semester</th>
                        <th>Hours</th>
                        <th>Units</th>
                        <th>Hours Lec</th>
                        <th>Hours Lab</th>
                        <th>Units Lec</th>
                        <th>Units Lab</th>
                        <th>Prerequisite</th>
                    </tr>
                </thead>
                <tbody>
                    {courses?.length === 0 ? (
                        <tr>
                            <td colSpan="11" style={{ textAlign: "center" }}>
                                No courses found.
                            </td>
                        </tr>
                    ) : (
                        courses.map((course, index) => (
                            <tr key={index}>
                                <td>{course.course_id}</td>
                                <td>{course.course_name}</td>
                                <td>{course.course_year}</td>
                                <td>{course.course_sem}</td>
                                <td>{course.course_hours}</td>
                                <td>{course.course_units}</td>
                                <td>{course.hours_lec || 0}</td>
                                <td>{course.hours_lab || 0}</td>
                                <td>{course.units_lec || 0}</td>
                                <td>{course.units_lab || 0}</td>
                                <td>{course.course_preq || "-"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </>
    );
}
