from sqlalchemy.orm import Session
from functions.courses_func import getCourse
from models.student_course_model import Student_Course as SC

def addEntry(student_id: str, program_id:str, db_connection: Session):
    courses = getCourse(student_id, program_id, db_connection)
    courses = [dict(row._mapping) for row in courses]
    student_courses = [SC(**course) for course in courses]

    db_connection.add_all(student_courses)
    