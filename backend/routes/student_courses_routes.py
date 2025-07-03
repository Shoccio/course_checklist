from fastapi import APIRouter, Depends
from functions.student_course_func import updateGrades
from functions.auth_func import checkRole
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db.db import get_db

router = APIRouter()

class Grades(BaseModel):
    grade: float
    remark: str 

@router.patch("/update-grade/{course_id}")
def updateGrade(course_id: str, newGrades: Grades,  
                db_connection: Session = Depends(get_db), _: None = checkRole(["admin"])):
    return updateGrades(course_id, newGrades.grade, newGrades.remark, db_connection)

