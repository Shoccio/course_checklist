from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from functions.program_func import getProgram, getProgramFirestore
from db.db import get_db

router = APIRouter()

@router.get("/get")
def getPrograms(db_connection: Session = Depends(get_db)):
    return getProgram(db_connection)

@router.get("/get-firestore")
def getPrograms():
    return getProgramFirestore()