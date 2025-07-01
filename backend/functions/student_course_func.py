from sqlalchemy.orm import Session
from functions.courses_func import getCourse
from models.student_course_model import Student_Course as SC
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status

def addEntry(student_id: str, program_id:str, db_connection: Session):
    try:
        courses = getCourse(student_id, program_id, db_connection)
        courses = [dict(row._mapping) for row in courses]
        student_courses = [SC(**course) for course in courses]

        db_connection.add_all(student_courses)
    except SQLAlchemyError:
        db_connection.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Error occured adding corresponding courses")
    
def editStudentCourses(new_id: str, old_id:str, db_connection: Session):
    try:
        db_connection.query(SC).filter_by(student_id = old_id).update({SC.student_id: new_id}, synchronize_session=False)
    except SQLAlchemyError:
        db_connection.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Error occured editing student courses")
    
def deleteCourses(course_id: str, db_connection: Session):
    try:
        course = db_connection.query(SC).filter_by(course_id = course_id).first()

        if not course:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course not found")
        db_connection.delete(course)
    except SQLAlchemyError:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Error occured deleting course")
    
def deleteStudent(student_id: str, db_connection: Session):
    try:
        db_connection.query(SC).filter_by(student_id = student_id).delete(synchronize_session=False)
    except:
        db_connection.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Error occured deleting student")

    
def getStudentCourses(student_id: str, db_connection: Session):
    try:
        courses = db_connection.query(SC).filter(SC.student_id == student_id).all()
        return courses
    except SQLAlchemyError:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Student is not found")