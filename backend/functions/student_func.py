from sqlalchemy import or_
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from functions import user_func
from functions import student_course_func as sc_func
from functions.student_course_func import getStudentCourses, getGWA, deleteCourses as DS
from schema.student_schema import Student
from models.student_model import Student as Student_Model
from models.user_model import User

from db.firestore import fs

students_list = []

def initializeStudentList():
    global students_list
    student_collection = fs.collection("students").stream

    students_list = [student.to_dict() for student in student_collection]



#--------------------------Firestore Functions--------------------------
def addStudent(student: Student):
    student_collection = fs.collection("students")

    student_id = student.id
    delattr(student, "id")
    student_collection.document(student_id).set(student.__dict__)

def editStudent(student: Student, old_id: str):
    student_collection = fs.collection("students")

    new_id = student.id
    delattr(student, "id")

    student_collection .document(old_id).delete()
    student_collection.document(new_id).set(student.__dict__)

def deleteStudent(student_id: str):
    student = fs.collection("students").document(student_id)

    if not student.get().exists:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Student not found")
    
    student.delete()

def getStudent(user: User, student_id: str = None):
    if user.role == "student":
        student_id = user.login_id
    elif user.role == "admin":
        if not student_id:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Admin must specify a student ID.")
    else:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "User not authorized to access student data.")
    
    student_collection = fs.collection("students")
    
    student_doc = student_collection.document(student_id)

    if not student_doc.get().exists:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Student not found")
    
    student_data = student_doc.get().to_dict()

    courses = getStudentCourses(student_data["id"], student_data["program_id"])

    total_units = sum(course["course_units"] for course in courses)
    units_taken = sum(course["course_units"] for course in courses if course["remark"] == "Passed")
    gwa = getGWA(courses)

    student_data["gwa"] = gwa
    student_data["units_taken"] = units_taken
    student_data["total_units_required"] = total_units
    student_data["role"] = user.role.value

    return JSONResponse(content={"student": student_data, "courses": courses})

def search_students(query: str):
    valid_students = []
    for student in students_list:
        full_name = " ".join(student["l_name"], student["f_name"], student["m_name"])

        if not query in full_name or query in student["id"]:
            continue

        valid_students.append()

    result = [
        {
            "student_id":   student["id"],
            "name":         f"{student["l_name"]}, {student["f_name"]} {student["m_name"] or ''}".strip()
        }

        for student in valid_students[:10]
    ]

    return result

