from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from models.program_course_model import Program_Courses

from db.firestore import fs

#--------------------------Firestore Functions--------------------------
def getCourseByProgramFirestore(program_id: str):
    program_courses_collection = fs.collection("program_course")

    courses = program_courses_collection.document(program_id).collection("courses").stream()

    courses_dict = [course.to_dict() for course in courses]

    return courses_dict

#--------------------------MySQL Functions--------------------------

def updateOrder(program_id: str, course_ids: list[str], db_connection: Session):
    try:
        for index, course_id in enumerate(course_ids):
            (db_connection.query(Program_Courses).
             filter_by(program_id = program_id, course_id = course_id).
             update({"sequence": index})
            )

    except SQLAlchemyError:
        db_connection.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Error occured updating order")