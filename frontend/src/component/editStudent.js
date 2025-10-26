import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./modal";
import style from "../style/button.module.css"
import { FaPen, FaPlus } from "react-icons/fa";
import { createPortal } from "react-dom";

import { useGetProgram } from "../App";

export default function EditStudent({ onSubmit, student, isViewing }) {
    let title = "Edit Student"
    const programs = useGetProgram();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
    student_id: "",
    student_email: "",
    student_dept: "",
    program_id: "",
    student_f_name: "",
    student_l_name: "",
    student_m_name: "",
    student_year: "",
    student_status: "",
    });

    const getProgram = useGetProgram()
    const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, student.student_id);
    setShowModal(false);
    setFormData({
        student_id: "",
        student_email: "",
        student_dept: "",
        program_id: "",
        student_f_name: "",
        student_l_name: "",
        student_m_name: "",
        student_year: "",
        student_status: "",
    });
    };


    useEffect(() => {
    if(showModal){
        document.body.style.overflow = "hidden";
    }
    else{
        document.body.style.overflow = "";
    }

    return () => {
        document.body.style.overflow = "";
    };

    }, [showModal])

    useEffect(() => {
        if (student) {
            setFormData({
                student_id: student.student_id || "",
                student_email: student.student_email || "",
                student_dept: student.student_dept || "",
                program_id: student.program_id || "",
                student_f_name: student.student_f_name || "",
                student_l_name: student.student_l_name || "",
                student_m_name: student.student_m_name || "",
                student_year: student.student_year || "",
                student_status: student.student_status || "",
            });
        }
    }, [student]);

    return (
    <>
        <FaPen
        title={isViewing ? "Edit Student" : "No student selected"}
        onClick={() => {
            if (!isViewing) return;
            setShowModal(true);
        }}
        className={`${style.editIcon} ${!isViewing ? style.disabled : ""}`}
        />


        {showModal && createPortal(
                    <Modal title={title} programs={programs} formData={formData} 
                            handleSubmit={handleSubmit} handleChange={handleChange} 
                            onClose={() => setShowModal(false)} />
                            , document.body
        )}
    </>
    );
}

