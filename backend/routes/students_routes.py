from fastapi import APIRouter, Depends, HTTPException, status, Query
from db.db import get_db
from sqlalchemy.orm import Session
from schema.student_schema import Student
from models.user_model import User
from functions import student_func
from functions.auth_func import getCurrentUser, checkRole


router = APIRouter()

@router.post("/add")
def addStudent(student: Student, db_connection: Session = Depends(get_db), role: str = checkRole(["admin"])):
    return student_func.addStudent(student, db_connection)

@router.post("/add-firestore")
def addStudent(student: Student):
    return student_func.addStudent(student)

@router.put("/edit/{student_id}")
def editStudent(student: Student, student_id: str, db_connection: Session = Depends(get_db), role: str = checkRole(["admin"])):
    return student_func.editStudent(student, student_id, db_connection)

@router.put("/edit-firestore/{student_id}")
def editStudent(student: Student, student_id: str):
    return student_func.editStudent(student, student_id)

@router.delete("/delete/{student_id}")
def deleteStudent(student_id: str, db_connection: Session = Depends(get_db), role: str = checkRole(["admin"])):
    return student_func.deleteStudent(student_id, db_connection)

@router.delete("/delete-firestore/{student_id}")
def deleteStudent(student_id: str):
    return student_func.deleteStudent(student_id)
    
@router.get("/get/details")
def get_own_student_details(
    user: User = Depends(getCurrentUser),
    db_connection: Session = Depends(get_db)
):
    if user.role.value == "admin":
        return {"student": {"role": user.role.value}, "courses": []}
    
    return student_func.getStudent(user, db_connection)

@router.get("/search")
def search_students(q: str = Query(..., min_length=1), db_connection: Session = Depends(get_db)):
    return student_func.search_students(q, db_connection)

@router.get("/get/{student_id}")
def getStudentByID(
    student_id: str,
    user: User = Depends(getCurrentUser),
    db: Session = Depends(get_db)
):
    # Only admins can access this
    if user.role.value != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Only admins can access this route")
    
    return student_func.getStudent(user, db, student_id)