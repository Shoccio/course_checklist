from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from
from models.program_course_model import Program_Courses

def updateOrder(program_id: str, course_id: str, order:int, db_connection: Session):
    try:
        course = db_connection.query(Program_Courses).filter_by(program_id = program_id, course_id = course_id).first()
        course.sequence = order

    except SQLAlchemyError:
        db_connection.rollback()
        raise