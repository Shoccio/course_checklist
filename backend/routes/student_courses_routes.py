from fastapi import APIRouter, Depends
from functions.student_course_func import updateGrades, getStudentCourses
from functions.auth_func import checkRole
from sqlalchemy.orm import Session
from pydantic import BaseModel

router = APIRouter()

class Grades(BaseModel):
    grade: float
    remark: str 

@router.get("/get")
def getStudentCourse(student_id: str, program_id: str, role: str = checkRole(["admin", "student"])):
    return getStudentCourses(student_id, program_id)

@router.patch("/update-grade/{course_id}")
def updateGrade(course_id: str, newGrades: Grades, role: str = checkRole(["admin"])):
    return updateGrades(course_id, newGrades.grade, newGrades.remark)

