# functions/course_utils.py
from sqlalchemy.orm import Session
from sqlalchemy import select, null, literal, join
from models.course_model import Course
from models.program_course_model import Program_Courses as PC

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
