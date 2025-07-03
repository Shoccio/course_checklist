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

def addStudent(student: Student, db_session: Session):
    student_model = Student_Model(**student.model_dump())

    try:
        db_session.add(student_model)

        user_func.addUser(student.student_id, db_session)
        sc_func.addEntry(student.student_id, student.program_id, db_session)
        db_session.commit()
    except SQLAlchemyError:
        db_session.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Error occured adding student")

def editStudent(student: Student, student_id: str, db_session: Session):
    student_model = student.model_dump()

    try:
        old_student = db_session.query(Student_Model).filter_by(student_id = student_id).first()

        if not old_student:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Student not found")

        user_func.editLoginId(student_model["student_id"], student_id, db_session)

        for key, value in student_model.items():
            setattr(old_student, key, value)

        db_session.commit()
    except SQLAlchemyError:
        db_session.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Error occured editing student")

def deleteStudent(student_id: str, db_session: Session):
    try:
        user_func.deleteUser(student_id, db_session)
        DS(student_id, db_session)

        student = db_session.query(Student_Model).filter_by(student_id = student_id).one()

        db_session.delete(student)
        db_session.commit()
    except SQLAlchemyError:
        db_session.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Error occured deleting student")
    
def getStudent(user: User, db_session: Session, student_id: str = None):
    # Determine the student ID to fetch
    if user.role.value == "student":
        # Students can only access their own records
        student_id = user.login_id
    elif user.role.value == "admin":
        if not student_id:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Admin must specify a student ID.")
    else:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "User not authorized to access student data.")

    # Fetch student details
    detail = db_session.query(Student_Model).filter(Student_Model.student_id == student_id).first()
    if not detail:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Student not found")


    courses = getStudentCourses(student_id, db_session)

    total_units = sum(course["course_units"] for course in courses)
    units_taken = sum(course["course_units"] for course in courses if course["remark"] == "Passed")
    gwa = getGWA(courses)

    student_data = {
        "student_id": detail.student_id,
        "name": f"{detail.student_l_name}, {detail.student_f_name} {detail.student_m_name or ''}".strip(),
        "program": detail.program_id,  
        "year": detail.student_year,
        "gwa": gwa,                 
        "units_taken": units_taken,        
        "total_units_required": total_units,
        "status": detail.student_status.value,              
        "role": user.role.value
    }



    return JSONResponse(content={"student": student_data, "courses": courses})


def search_students(q: str, db_session: Session):
    results = (
        db_session.query(Student_Model).filter(
            or_(
                Student_Model.student_id.ilike(f"%{q}%"),
                Student_Model.student_f_name.ilike(f"%{q}%"),
                Student_Model.student_l_name.ilike(f"%{q}%")
            )
        )
        .limit(10).all()
    )

    students = [
        {
            "student_id": student.student_id,
            "name": f"{student.student_l_name}, {student.student_f_name} {student.student_m_name or ''}".strip()
        }
        for student in results
    ]

    return {"results": students}