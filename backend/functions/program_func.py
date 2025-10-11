from models.programs_model import Program
from sqlalchemy.orm import Session

from db.firestore import fs

#--------------------------Firestore Functions--------------------------
def getProgramFirestore():
    docs = fs.collection("programs").stream()

    ids = [doc.to_dict()["id"] for doc in docs]

    return ids

#--------------------------MySQL Functions--------------------------
def getProgram(db_connection: Session):
    ids = db_connection.query(Program).all()
    return ids