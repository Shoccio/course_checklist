import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./modal";
import { FaPlus } from "react-icons/fa";
import { createPortal } from "react-dom";


export default function AddStudent({ onSubmit }) {
  let title = "Add New Student";
  const [programs, setPrograms] = useState([]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setShowModal(false);
    setFormData({
    student_id: "",
    email: "",
    department: "",
    program: "",
    student_f_name: "",
    student_l_name: "",
    student_m_name: "",
    year: "",
    status: "",
    });
  };

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

  return (
    <>
      <FaPlus
        style={{ cursor: "pointer" }}
        title="Add Student"
        onClick={() => setShowModal(true)}
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

