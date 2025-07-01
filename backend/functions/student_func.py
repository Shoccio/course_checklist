from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from functions import user_func
from functions import student_course_func as sc_func
from functions.student_course_func import deleteStudent as DS
from schema.student_schema import Student
from models.student_model import Student as Student_Model

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

