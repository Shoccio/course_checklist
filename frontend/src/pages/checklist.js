import React, { useEffect, useState } from "react";
import { FaPrint } from "react-icons/fa";
import style from "../style/checklist.module.css";
import StudentSearchBar from "../component/searchBar";
import CourseTable from "../component/student_table";
import AddStudent from "../component/addStudent";
import EditStudent from "../component/editStudent";
import HeaderWebsite from "../component/header";
import { useNavigate } from "react-router-dom";

// Static mock data (instead of API)
const mockStudents = [
  {
    student_id: "2023-001",
    student_f_name: "John",
    student_l_name: "Doe",
    program_id: "BSCS",
    total_units_required: 150,
    student_year: "4th",
    student_status: "Regular",
    units_taken: 132,
    gwa: 1.75,
    role: "student",
  },
];

const mockCourses = [
  {
    course_id: "CS101",
    course_name: "Introduction to Programming",
    course_year: 1,
    course_sem: 1,
    course_hours: 3,
    course_units: 3,
    course_preq: "",
    grade: "1.75",
    remark: "Passed",
  },
  {
    course_id: "CS102",
    course_name: "Data Structures",
    course_year: 1,
    course_sem: 2,
    course_hours: 3,
    course_units: 3,
    course_preq: "CS101",
    grade: "2.00",
    remark: "Passed",
  },
  {
    course_id: "CS201",
    course_name: "Algorithms",
    course_year: 2,
    course_sem: 1,
    course_hours: 3,
    course_units: 3,
    course_preq: "CS102",
    grade: "1.50",
    remark: "Passed",
  },
];

export default function Checklist({ currentUser = { role: "admin" }, setCurrentUser = () => {} }) {
  const pageName = "CURRICULUM CHECKLIST";
  const navigate = useNavigate();

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isViewing, setIsViewing] = useState(false);

  // Static logout just returns to home
  const signOut = () => {
    navigate("/");
  };

  // Simulate adding/editing students locally
  const addStudent = (student) => {
    console.log("Static add student:", student);
  };

  const editStudent = (student, old_id) => {
    console.log("Static edit student:", student, "replacing", old_id);
  };

  // "Search" simulation — called from StudentSearchBar
  const handleStudentSelect = (student_id) => {
    const found = mockStudents.find((s) => s.student_id === student_id);
    if (found) {
      setSelectedStudent(found);
      setCourses(mockCourses);
      setIsViewing(true);
    } else {
      alert("Student not found");
    }
  };

  // Simulate loading the current user
  useEffect(() => {
    setCurrentUser({ role: "admin" });
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

          {selectedStudent ? (
            <>
              <div className={style.studentResidency}>
                <div className={style.lBlock}>
                  <span>Student ID: {selectedStudent.student_id}</span>
                  <span>
                    Student Name: {selectedStudent.student_l_name},{" "}
                    {selectedStudent.student_f_name}
                  </span>
                  <span>Program/Major: {selectedStudent.program_id}</span>
                  <span>
                    Total Units Required for this Course:{" "}
                    {selectedStudent.total_units_required}
                  </span>
                </div>
                <div className={style.rBlock}>
                  <span>Year: {selectedStudent.student_year}</span>
                  <span>Status: {selectedStudent.student_status}</span>
                  <span>Total Units Taken: {selectedStudent.units_taken}</span>
                  <span>GWA: {selectedStudent.gwa}</span>
                </div>
              </div>

              <CourseTable
                student_id={selectedStudent.student_id}
                courses={courses}
                role={currentUser.role}
                onSelectStudent={handleStudentSelect}
              />
            </>
          ) : (
            <p style={{ marginTop: "2rem", fontStyle: "italic" }}>
              Search for a student to display their checklist.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
