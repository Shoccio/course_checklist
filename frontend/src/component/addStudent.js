import React, { useEffect, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { FaPlus } from "react-icons/fa";
import style from "../style/studentPopUp.module.css";

export default function AddStudentModal({ onSubmit }) {
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

  return (
    <>
      <FaPlus
        style={{ cursor: "pointer" }}
        title="Add Student"
        onClick={() => setShowModal(true)}
      />

      {showModal && createPortal(
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h3>Add New Student</h3>
            <form onSubmit={handleSubmit} className={style.modalForm}>
              <input name="student_id" value={formData.student_id} onChange={handleChange} placeholder="Student ID" required />
              <input name="student_email" value={formData.student_email} onChange={handleChange} placeholder="Email" required />
              <input name="student_dept" value={formData.student_dept} onChange={handleChange} placeholder="Department" required />
              <select name="program_id" value={formData.program_id} onChange={handleChange} required>
                <option value="">Select Program</option>
                {programs.map((program) => {
                  return (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_name}
                  </option>
                  );
                })}
              </select>
              <input name="student_f_name" value={formData.student_f_name} onChange={handleChange} placeholder="First Name" required />
              <input name="student_l_name" value={formData.student_l_name} onChange={handleChange} placeholder="Last Name" required />
              <input name="student_m_name" value={formData.student_m_name} onChange={handleChange} placeholder="Middle Name" />
              <input name="student_year" value={formData.student_year} onChange={handleChange} placeholder="Year" type="number" required />
              <select name="student_status" value={formData.student_status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
              </select>
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>,
        document.body   
      )}
    </>
  );
}
