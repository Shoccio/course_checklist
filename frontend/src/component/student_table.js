import React, { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa"; 
import style from "../style/table.module.css";

// Helper function to add ordinal suffix to numbers (1 -> 1st, 2 -> 2nd, etc.)
function ordinal(n) {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

// --- Static mock course data ---
const STATIC_COURSES = [
  { course_id: "CS101", course_name: "Introduction to Programming", course_units: 3, grade: 1.5, remark: "Passed", year: 1, semester: 1 },
  { course_id: "CS102", course_name: "Data Structures", course_units: 3, grade: 2.0, remark: "Passed", year: 1, semester: 2 },
  { course_id: "CS201", course_name: "Algorithms", course_units: 3, grade: 1.25, remark: "Passed", year: 2, semester: 1 },
  { course_id: "CS202", course_name: "Operating Systems", course_units: 4, grade: 2.75, remark: "Failed", year: 2, semester: 2 },
  { course_id: "CS203", course_name: "Database Systems", course_units: 3, grade: null, remark: "Incomplete", year: 2, semester: 2 },
];

export default function CourseTable({ student_id, role }) {
  const [courses, setCourses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedGrade, setEditedGrade] = useState("");
  const [editedRemark, setEditedRemark] = useState("");

  // load static data when student is selected
  useEffect(() => {
    if (student_id) {
      setCourses(STATIC_COURSES);
    } else {
      setCourses([]);
    }
  }, [student_id]);

  const handleEditClick = (index, grade, remark) => {
    setEditIndex(index);
    setEditedGrade(grade ?? "");
    setEditedRemark(remark ?? "Passed");
  };

  const handleSave = () => {
    const updatedCourses = [...courses];
    updatedCourses[editIndex] = {
      ...updatedCourses[editIndex],
      grade: editedGrade || "-",
      remark: editedRemark,
    };
    setCourses(updatedCourses);
    setEditIndex(null);
  };

  if (!student_id) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        🔍 Search for a student to display their courses.
      </p>
    );
  }

  return (
    <>
      <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        Curriculum Residency Evaluation
      </h3>

      <div className={style.legendContainer}>
        <div className={style.legendItem}>
          <div className={`${style.legendBox} ${style.passedBox}`}></div>
          <span>Passed</span>
        </div>
        <div className={style.legendItem}>
          <div className={`${style.legendBox} ${style.incompleteBox}`}></div>
          <span>Incomplete</span>
        </div>
        <div className={style.legendItem}>
          <div className={`${style.legendBox} ${style.failedBox}`}></div>
          <span>Failed</span>
        </div>
      </div>

      <table className={style.tble}>
        <thead>
          <tr>
            <th>SUB CODE</th>
            <th>SUB DESCRIPTION</th>
            <th>TOTAL UNIT</th>
            <th>CREDIT EARNED</th>
            <th>GRADE</th>
            <th>REMARK</th>
            {role === "admin" && <th>&nbsp;</th>}
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
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
                      <td colSpan="7" style={{ fontWeight: "bold" }}>
                        {ordinal(year)} Year, {ordinal(semester)} Sem
                      </td>
                    </tr>
                  );
                  prevYear = year;
                  prevSem = semester;
                }

                const isEditing = editIndex === index;

                rows.push(
                  <tr
                    key={index}
                    className={
                      course.remark === "Passed"
                        ? style.passedRow
                        : course.remark === "Incomplete"
                        ? style.incompleteRow
                        : course.remark === "Failed"
                        ? style.failedRow
                        : style.defaultRow
                    }
                  >
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
                          <option value="N/A">N/A</option>
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
                    {!isEditing && role === "admin" && (
                      <td>
                        <FaPencilAlt
                          style={{ cursor: "pointer" }}
                          title="Edit"
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
