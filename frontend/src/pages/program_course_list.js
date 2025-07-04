import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaPlus, FaPrint } from "react-icons/fa"; // pencil icon
import style from "../style/programlist.module.css";
import HeaderWebsite from "../component/header";
import ProgramTable from "../component/program_table";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProgramCourseList() {
    let pageName = "PROGRAM COURSELIST"
    const navigate = useNavigate();

    const [programs, setPrograms] = useState([]);
    const [program_id, setProgram] = useState("");
    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
    const getProgram = async () => {
        try {
        const progrms = await axios.get("http://127.0.0.1:8000/program/get");

        setPrograms(progrms.data);
        }
        catch (err){
        console.error("Getting programs failed: ", err);
        }
    };

    getProgram();

    }, []);
    
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

    const getCourses = async (program_id) => {
        try {
            const courses = await axios.get(`http://127.0.0.1:8000/course/get/${program_id}`, {
                withCredentials: true,
            });
            setCourses(courses.data);
        }
        catch (err){
            console.error("Getting Course failed: ", err);
        }
    }
    const handleProgramChange = (e) => {
        const newValue = e.target.value.trim();
        setProgram(newValue);
        newValue === "" ? setCourses([]) : getCourses(newValue)
        console.log("courses length: ", courses.length);
    };


    return (
        <div className={style.programChecklist}>
            <HeaderWebsite pageName={pageName} logOut={signOut} />

            <div className={style.courseBody}>
                <select name="program_id" value={program_id} 
                onChange={ (e) => handleProgramChange(e)} required>
                    <option value="">Select Program</option>
                    {programs.map((program) => {
                    return (
                    <option key={program.program_id} value={program.program_id}>
                        {program.program_name}
                    </option>
                    );
                    })}
                </select>


                <div className={style.programDetail}>
                    <h3>
                        PROGRAM COURSELIST
                    </h3>
                    <ProgramTable courses={courses} />
                </div>
            </div>
        </div>
    );
}
