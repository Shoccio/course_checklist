import React, { useState } from "react";
import { FaPencilAlt } from "react-icons/fa"; // pencil icon
import style from "../style/table.module.css"; // adjust if needed
import axios from "axios";

// 🔧 Helper function to add ordinal suffix to numbers (1 -> 1st, 2 -> 2nd, etc.)
function ordinal(n) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export default function ProgramTable({courses}) {

    return (
        <>
            <table>
                <thead>
                    <tr>
                    <th>SUB CODE</th>
                    <th>SUB DESCRIPTION</th>
                    <th>HOURS</th>
                    <th>TOTAL UNIT</th>
                    <th>PREREQUISITE</th>
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
                        a.course_year !== b.course_year
                            ? a.course_year - b.course_year
                            : a.course_sem - b.course_sem
                        );

                        const rows = [];
                        let prevYear = null;
                        let prevSem = null;

                        sorted.forEach((course, index) => {
                        const { course_year, course_sem } = course;

                        if (course_year !== prevYear || course_sem !== prevSem) {
                            rows.push(
                            <tr key={`label-${index}`} className={style.yearSem}>
                                <td colSpan="6" style={{ fontWeight: "bold" }}>
                                {ordinal(course_year)} Year, {ordinal(course_sem)} Sem
                                </td>
                            </tr>
                            );
                            prevYear = course_year;
                            prevSem = course_sem;
                        }

                        rows.push(
                            <tr key={index} className={style.defaultRow}>
                                <td>{course.course_id}</td>
                                <td>{course.course_name}</td>
                                <td>{course.course_hours}</td>
                                <td>{course.course_units}</td>
                                <td>{course.course_preq}</td>
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
