import React, { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import style from "../style/programlist.module.css";
import HeaderWebsite from "../component/header";
import ProgramTable from "../component/program_table";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProgramCourseList() {
  let pageName = "PROGRAM COURSELIST";
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [program_id, setProgram] = useState("");
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getProgram = async () => {
      try {
        const progrms = await axios.get("http://127.0.0.1:8000/program/get");
        setPrograms(progrms.data);
      } catch (err) {
        console.error("Getting programs failed: ", err);
      }
    };

    getProgram();
  }, []);

  const signOut = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/");
    }
  };

  const getCourses = async (program_id) => {
    try {
      const courses = await axios.get(
        `http://127.0.0.1:8000/course/get/${program_id}`,
        { withCredentials: true }
      );
      setCourses(courses.data);
    } catch (err) {
      console.error("Getting Course failed: ", err);
    }
  };

  const handleProgramChange = (e) => {
    const newValue = e.target.value.trim();
    setProgram(newValue);
    setIsEditing(false); // reset editing mode
    newValue === "" ? setCourses([]) : getCourses(newValue);
  };

  const toggleEditing = () => {
    if (program_id === "") return;
    setIsEditing((prev) => !prev);
  };

  return (
    <div className={style.programChecklist}>
      <HeaderWebsite pageName={pageName} logOut={signOut} />

      <div className={style.courseBody}>
        <select
          name="program_id"
          value={program_id}
          onChange={handleProgramChange}
          required
          disabled={isEditing}
        >
          <option value="">Select Program</option>
          {programs.map((program) => (
            <option key={program.program_id} value={program.program_id}>
              {program.program_name}
            </option>
          ))}
        </select>

        <div className={style.programDetail}>
          <h3>
            PROGRAM COURSELIST
            <span className={style.editButton}>
              <FaPencilAlt
                title={
                  program_id === ""
                    ? "Select a program to enable editing"
                    : "Toggle Editing"
                }
                className={`${style.editIcon} ${
                  program_id === "" ? style.disabled : ""
                }`}
                onClick={toggleEditing}
              />
            </span>
          </h3>

          <ProgramTable
            courses={courses}
            isEditing={isEditing}
            onReorder={(newOrder) => setCourses(newOrder)}
          />
        </div>
      </div>
    </div>
  );
}
