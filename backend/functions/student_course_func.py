# functions/student_course_func.py
from sqlalchemy.orm import Session
from functions.course_utils import getCourse
from models.student_course_model import Student_Course as SC
from models.course_model import Course
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
    
def getStudentCourses(student_id: str, db: Session):
    results = (
        db.query(
            Course.course_name,
            Course.course_units,
            Course.course_year,
            Course.course_sem,
            SC.grade,
            SC.remarks,
            Course.course_id,
        )
        .join(Course, Course.course_id == SC.course_id)
        .filter(SC.student_id == student_id)
        .all()
    )

    course_data = []
    for name, units, year, sem, grade, remarks, code in results:
        course_data.append({
            "course_id": code,
            "course_name": name,
            "course_units": units,
            "year": year,
            "semester": sem,
            "grade": grade,
            "remark": remarks or "N/A"
        })

    return course_data

def getGWA(courses):
    total_weighted = 0
    total_units = 0

    for course in courses:
        grade = course.get("grade")
        units = course.get("course_units")
        remark = course.get("remark", "")

        if grade is not None and remark == "Passed":
            total_weighted += grade * units
            total_units += units

    if total_units == 0:
        return 0.0  # or 0.0, or "N/A", depending on your app

    return round(total_weighted / total_units, 4)  # Rounded to 4 decimal places

def updateGrades(course_id: str, grade: float, remark: str, db_connection: Session):
    if grade == -1.0:
        grade = None
    try:
        (db_connection.query(SC).filter_by(course_id = course_id)
         .update({SC.grade: grade, SC.remarks: remark}, synchronize_session=False))
        db_connection.commit()

        return {"message": "Edit grade successful"}
    except SQLAlchemyError:
        db_connection.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Error updating grades")