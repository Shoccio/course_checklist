import React, { useState } from "react";
import style from "../../style/table.module.css";
import axios from "axios";
import { API_URL } from "../../misc/url";

export default function CoursesTable({ courses, onCourseAdded }) {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        course_id: "",
        course_name: "",
        course_year: "",
        course_sem: "",
        hours_lec: "",
        hours_lab: "",
        units_lec: "",
        units_lab: "",
        course_preq: "",
        course_hours: 0,
        course_units: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        await axios.post(API_URL + "/course/add", formData)
        .then((res) => {
                setFormData({
                course_id: "",
                course_name: "",
                course_year: "",
                course_sem: "",
                hours_lec: "",
                hours_lab: "",
                units_lec: "",
                units_lab: "",
                course_preq: "",
                course_hours: 0,
                course_units: 0,
            });
            setShowModal(false);
            if (onCourseAdded) {
                onCourseAdded();
            }
        })
        .catch((err) =>{
            setError(err.response?.data?.message || "Failed to add course");
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <>
            <div className={style.tableHeader}>
                <h3>Courses</h3>
                <button onClick={() => setShowModal(true)} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
                    + Add Course
                </button>
            </div>

            <table className={style.tble}>
                <thead>
                    <tr>
                        <th rowSpan={2}>ID</th>
                        <th rowSpan={2}>Name</th>
                        <th rowSpan={2}>Year</th>
                        <th rowSpan={2}>Semester</th>
                        <th colSpan={2}>Hours</th>
                        <th colSpan={2}>Units</th>
                        <th rowSpan={2}>Prerequisite</th>
                    </tr>
                    <tr>
                        <th>Lec</th>
                        <th>Lab</th>
                        <th>Lec</th>
                        <th>Lab</th>
                    </tr>
                </thead>
                <tbody>
                    {courses?.length === 0 ? (
                        <tr>
                            <td colSpan="11" style={{ textAlign: "center" }}>
                                No courses found.
                            </td>
                        </tr>
                    ) : (
                        courses.map((course, index) => (
                            <tr key={index}>
                                <td>{course.course_id}</td>
                                <td>{course.course_name}</td>
                                <td>{course.course_year}</td>
                                <td>{course.course_sem}</td>
                                <td>{course.hours_lec || 0}</td>
                                <td>{course.hours_lab || 0}</td>
                                <td>{course.units_lec || 0}</td>
                                <td>{course.units_lab || 0}</td>
                                <td>{course.course_preq || "-"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {showModal && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.modal}>
                        <h3>Add New Course</h3>
                        {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
                        <form onSubmit={handleSubmit} style={modalStyles.form}>
                            <input
                                type="text"
                                name="course_id"
                                placeholder="Course ID"
                                value={formData.course_id}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="course_name"
                                placeholder="Course Name"
                                value={formData.course_name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="course_year"
                                placeholder="Year"
                                value={formData.course_year}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="course_sem"
                                placeholder="Semester"
                                value={formData.course_sem}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="hours_lec"
                                placeholder="Hours (Lecture)"
                                value={formData.hours_lec}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="hours_lab"
                                placeholder="Hours (Lab)"
                                value={formData.hours_lab}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="units_lec"
                                placeholder="Units (Lecture)"
                                value={formData.units_lec}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="units_lab"
                                placeholder="Units (Lab)"
                                value={formData.units_lab}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="course_preq"
                                placeholder="Prerequisite"
                                value={formData.course_preq}
                                onChange={handleChange}
                            />
                            <div style={modalStyles.buttonGroup}>
                                <button type="submit" disabled={loading}>
                                    {loading ? "Adding..." : "Add Course"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={modalStyles.cancelBtn}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

const modalStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        width: "90%",
        maxHeight: "90vh",
        overflowY: "auto",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    buttonGroup: {
        display: "flex",
        gap: "0.5rem",
        marginTop: "1rem",
    },
    cancelBtn: {
        backgroundColor: "#f0f0f0",
        color: "#333",
    },
};
