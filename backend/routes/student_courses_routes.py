from fastapi import APIRouter, Depends
from functions.student_course_func import updateGrades, getStudentCourses
from functions.auth_func import checkRole
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db.db import get_db

router = APIRouter()

class Grades(BaseModel):
    grade: float
    remark: str 

@router.get("/get")
def getStudentCourse(student_id: str, program_id: str,
                      db_connection: Session = Depends(get_db), role: str = checkRole(["admin", "student"])):
    return getStudentCourses(student_id, program_id, db_connection)

@router.patch("/update-grade/{course_id}")
def updateGrade(course_id: str, newGrades: Grades,  
                db_connection: Session = Depends(get_db), role: str = checkRole(["admin"])):
    return updateGrades(course_id, newGrades.grade, newGrades.remark, db_connection)

