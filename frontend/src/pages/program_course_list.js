import React, { useEffect, useRef, useState } from "react";
import { FaPencilAlt, FaPrint } from "react-icons/fa";
import style from "../style/programlist.module.css";
import HeaderWebsite from "../component/header";
import ProgramTable from "../component/program_table";
import { useNavigate } from "react-router-dom";

export default function ProgramCourseList({ currentUser }) {
  const pageName = "PROGRAM COURSELIST";
  const navigate = useNavigate();

  // ✅ Static data instead of fetching from backend
  const staticPrograms = {
    "BSCS": {
      program_id: "BSCS",
      program_name: "Bachelor of Science in Computer Science",
      specialization: "Software Development",
    },
    "BSIT": {
      program_id: "BSIT",
      program_name: "Bachelor of Science in Information Technology",
      specialization: "Network Administration",
    },
  };

  const staticCourses = {
    "BSCS": [
      {
        course_id: "CS101",
        course_name: "Introduction to Programming",
        course_year: 1,
        course_sem: 1,
        course_hours: 3,
        course_units: 3,
        course_preq: "",
        hours_lec: 3,
        hours_lab: 0,
        units_lec: 3,
        units_lab: 0,
        sequence: 1,
      },
      {
        course_id: "CS102L",
        course_name: "Programming Laboratory",
        course_year: 1,
        course_sem: 1,
        course_hours: 3,
        course_units: 1,
        course_preq: "CS101",
        hours_lec: 0,
        hours_lab: 3,
        units_lec: 0,
        units_lab: 1,
        sequence: 2,
      },
      {
        course_id: "CS201",
        course_name: "Data Structures and Algorithms",
        course_year: 2,
        course_sem: 1,
        course_hours: 3,
        course_units: 3,
        course_preq: "CS101",
        hours_lec: 3,
        hours_lab: 0,
        units_lec: 3,
        units_lab: 0,
        sequence: 3,
      },
    ],
    "BSIT": [
      {
        course_id: "IT101",
        course_name: "Computer Systems Fundamentals",
        course_year: 1,
        course_sem: 1,
        course_hours: 3,
        course_units: 3,
        course_preq: "",
        hours_lec: 3,
        hours_lab: 0,
        units_lec: 3,
        units_lab: 0,
        sequence: 1,
      },
      {
        course_id: "IT102L",
        course_name: "Networking Basics Laboratory",
        course_year: 1,
        course_sem: 2,
        course_hours: 3,
        course_units: 1,
        course_preq: "IT101",
        hours_lec: 0,
        hours_lab: 3,
        units_lec: 0,
        units_lab: 1,
        sequence: 2,
      },
    ],
  };

  const [programs, setPrograms] = useState({});
  const [program_id, setProgram] = useState("");
  const [courses, setCourses] = useState([]);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);

  const printRef = useRef();

  useEffect(() => {
    setPrograms(staticPrograms);
  }, []);

  const signOut = () => {
    alert("Logged out (mock)");
    navigate("/");
  };

  const getCourses = (program_id) => {
    const mapped = staticCourses[program_id] || [];
    setCourses(mapped);
    setOriginalCourses(mapped);
  };

  const handleProgramChange = (e) => {
    const newValue = e.target.value.trim();
    setProgram(newValue);
    setIsEditing(false);
    setEditingRowId(null);
    if (newValue === "") {
      setCourses([]);
      setOriginalCourses([]);
    } else {
      getCourses(newValue);
    }
  };

  const startEditing = () => {
    if (!program_id) return;
    setOriginalCourses(courses);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setCourses(originalCourses);
    setIsEditing(false);
    setEditingRowId(null);
  };

  const saveEditing = () => {
    setOriginalCourses(courses);
    setIsEditing(false);
    setEditingRowId(null);
    alert("Courses saved (mock)");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={style.programChecklist}>
      <HeaderWebsite pageName={pageName} logOut={signOut} />
      <div className={style.courseBody} ref={printRef}>
        <select
          name="program_id"
          value={program_id}
          onChange={handleProgramChange}
          required
          disabled={isEditing}
        >
          <option value="">Select Program</option>
          {Object.values(programs).map((program) => (
            <option key={program.program_id} value={program.program_id}>
              {program.program_name}
            </option>
          ))}
        </select>

        <div>
          Specialization: {programs[program_id]?.specialization || "N/A"}
        </div>

        <div className={style.programDetail}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            PROGRAM COURSELIST
            <span className={style.buttonLoc}>
              {!isEditing ? (
                <>
                  <FaPencilAlt
                    title={program_id === "" ? "Select a program to enable editing" : "Enable Editing"}
                    className={`${style.editIcon} ${program_id === "" ? style.disabled : ""}`}
                    onClick={startEditing}
                  />
                  <FaPrint
                    title="Print Program Course List"
                    className={style.printIcon}
                    onClick={handlePrint}
                  />
                </>
              ) : (
                <>
                  <button onClick={saveEditing} className={style.buttons}>
                    Save
                  </button>
                  <button onClick={cancelEditing} className={style.buttons}>
                    Cancel
                  </button>
                </>
              )}
            </span>
          </h3>

          <ProgramTable
            courses={courses}
            isEditing={isEditing}
            editingRowId={editingRowId}
            onSetEditingRowId={setEditingRowId}
            onReorder={(newOrder) => setCourses(newOrder)}
            onCourseChange={(id, field, value) => {
              setCourses((prev) =>
                prev.map((c) => (c.course_id === id ? { ...c, [field]: value } : c))
              );
            }}
            onCourseDelete={(id) => setCourses((prev) => prev.filter((c) => c.course_id !== id))}
            onAddCourse={(year, sem) => {
              const newId = `new-${Date.now()}`;
              const newCourse = {
                course_id: newId,
                course_name: "",
                course_year: year,
                course_sem: sem,
                course_hours: 0,
                course_units: 0,
                course_preq: "",
                hours_lec: 0,
                hours_lab: 0,
                units_lec: 0,
                units_lab: 0,
                sequence: courses.length + 1,
              };
              const updated = [...courses, newCourse];
              setCourses(updated);
              return newId;
            }}
          />
        </div>
      </div>
    </div>
  );
}
