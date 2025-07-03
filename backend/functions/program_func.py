from models.programs_model import Program
from sqlalchemy.orm import Session


def getProgram(db_connection: Session):
    ids = db_connection.query(Program).all()
    return ids