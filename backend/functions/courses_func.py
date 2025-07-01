from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select, null, literal, join
from schema.course_schema import CourseSchema 
from models.course_model import Course
from models.program_course_model import Program_Courses as PC
from fastapi import HTTPException, status

def addCourse(course: CourseSchema, db_connection: Session):
    course_model = Course(**course.model_dump())
    
    db_connection.add(course_model)
    db_connection.commit()

    return {"message": "Course added successfully"}

def editCourse(course: CourseSchema, course_id: str, db_connection: Session):
    course_model = course.model_dump()
    try:
        old_course = db_connection.query(Course).filter_by(course_id = course_id).first()

        if not old_course:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course does not exist")
        
        for key, value in course_model.items():
            setattr(old_course, key, value)

        db_connection.commit()
    except SQLAlchemyError:
        db_connection.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "An error occured while editing a course")

    return {"message": "Course edited successfully"}


def deleteCourse(course_id: str, db_connection: Session):
    try:
        course = db_connection.query(Course).filter_by(course_id = course_id).first()
        
        if not course:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course does not exist")
        
        db_connection.delete(course)
        db_connection.commit()
    except SQLAlchemyError:
        db_connection.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "An error occured while deleting a course")

    return {"message": "Course deleted successfully"}

def getCourse(student_id: str, program_id: str, db_connection: Session):
    query = select(
        literal(student_id).label("student_id"),
        Course.course_id,
        null().label("grade"),
        null().label("remarks"),
    ).select_from(
        join(Course, PC, Course.course_id == PC.course_id)
    ).where(
        PC.program_id == program_id
    ).order_by(
        Course.course_year.asc(), Course.course_sem.asc()
    )

    return db_connection.execute(query).fetchall()