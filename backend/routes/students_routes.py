from fastapi import APIRouter, Depends, HTTPException, status, Query
from schema.student_schema import Student
from schema.user_schema import User
from functions import student_func
from functions.auth_func import getCurrentUser, checkRole


router = APIRouter()

@router.post("/add")
def addStudent(student: Student):
    return student_func.addStudent(student)

@router.put("/edit/{student_id}")
def editStudent(student: Student, student_id: str):
    return student_func.editStudent(student, student_id)

@router.delete("/delete/{student_id}")
def deleteStudent(student_id: str):
    return student_func.deleteStudent(student_id)

@router.get("/get/details")
def get_own_student_details(user: User = Depends(getCurrentUser)):
    if user["role"] == "admin":
        return {"student": {"role": user["role"]}, "courses": []}
    
    return student_func.getStudent(user)

@router.get("/search")
def search_students(q: str = Query(..., min_length=1)):
    return student_func.search_students(q)

@router.get("/get/{student_id}")
def getStudentByID(student_id: str, user: User = Depends(getCurrentUser)):
    if user["role"] != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Only admins can access this route")
    
    return student_func.getStudent(user, student_id)

