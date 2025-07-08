from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select
from schema.course_schema import CourseSchema 
from models.course_model import Course
from models.program_course_model import Program_Courses as PC
from functions.student_course_func import deleteCourses as DC
from functions.program_course_func import updateOrder
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
        DC(course_id, db_connection)
        
        db_connection.delete(course)
        db_connection.commit()
    except SQLAlchemyError:
        db_connection.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "An error occured while deleting a course")

    return {"message": "Course deleted successfully"}

def getCoursebyProgram(program_id: str, db_connection: Session):
    query = (
        select(
            Course.course_id,
            Course.course_name,
            Course.course_hours,
            Course.course_units,
            Course.course_preq,
            Course.course_year,
            Course.course_sem,
            Course.units_lec,
            Course.units_lab,
            Course.hours_lec,
            Course.hours_lab,
            PC.sequence
        )
        .join(PC, Course.course_id == PC.course_id)
        .where(PC.program_id == program_id)
        .order_by(Course.course_year.asc(), Course.course_sem.asc(), PC.sequence.asc())
    )
    result = db_connection.execute(query).mappings().all()
    return result

def updateCourses(program_id: str, courses: list[CourseSchema], db_connection: Session):
    try:
        updated_ids = []
        course_ids = [course.course_id for course in courses]

        updateOrder(program_id, course_ids, db_connection)

        for course_data in courses:
            db_course = db_connection.query(Course).filter(Course.course_id == course_data.course_id).first()
            if not db_course:
                raise HTTPException(status_code=404, detail=f"Course {course_data.course_id} not found")

            db_course.course_name = course_data.course_name
            db_course.course_hours = course_data.course_hours
            db_course.course_units = course_data.course_units
            db_course.course_preq = course_data.course_preq
            db_course.course_year = course_data.course_year
            db_course.course_sem = course_data.course_sem
            db_course.units_lec = course_data.units_lec
            db_course.units_lab = course_data.units_lab
            db_course.hours_lec = course_data.hours_lec
            db_course.hours_lab = course_data.hours_lab

            updated_ids.append(course_data.course_id)

        db_connection.commit()
        return {"updated": updated_ids}
    except SQLAlchemyError:
        db_connection.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "An error occured while updating courses")