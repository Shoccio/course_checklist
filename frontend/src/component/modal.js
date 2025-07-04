import { react } from "react";
import style from "../style/studentPopUp.module.css";


export default function Modal({title, programs, formData, handleSubmit, handleChange, onClose}){
    return(
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>
                <h3>{title}</h3>
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
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
                </form>
            </div>
        </div>
    );
}