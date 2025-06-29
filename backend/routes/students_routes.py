from fastapi import APIRouter, Depends
from db.db import get_db
from sqlalchemy.orm import Session
from schema.student_schema import Student
from functions import student_func
from functions.auth_func import checkRole

router = APIRouter()

@router.post("/add")
def addStudent(student: Student, db_connection: Session = Depends(get_db), _: None = checkRole(["admin"])):
    return student_func.addStudent(student, db_connection)

@router.put("/edit/{student_id}")
def editStudent(student: Student, student_id: str, db_connection: Session = Depends(get_db), _: None = checkRole(["admin"])):
    return student_func.editStudent(student, student_id, db_connection)

@router.delete("/delete/{student_id}")
def deleteStudent(student_id: str, db_connection: Session = Depends(get_db), _: None = checkRole(["admin"])):
    return student_func.deleteStudent(student_id, db_connection)
    