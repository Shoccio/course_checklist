from functions import courses_func
from functions.auth_func import checkRole
from db.db import get_db
from schema.course_schema import CourseSchema
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/add")
def addCourse(course: CourseSchema, db_connection: Session = Depends(get_db), _: None = checkRole(["admin"])):
    courses_func.addCourse(course, db_connection)
    return "Add successful"

@router.put("/edit/{course_id}")
def editCourse(course: CourseSchema, course_id: str, db_connection: Session = Depends(get_db), _: None = checkRole(["admin"])):
    courses_func.editCourse(course, course_id, db_connection)
    return "Edit successful"

@router.put("/update/{program_id}")
def updateCourses(program_id: str, course: list[CourseSchema], 
                  db_connection: Session = Depends(get_db), _: None = checkRole(["admin"])):
    return courses_func.updateCourses(program_id, course, db_connection)

@router.delete("/delete/{course_id}")
def deleteCourse(course_id: str, db_connection: Session = Depends(get_db), _: None = checkRole(["admin"])):
    courses_func.deleteCourse(course_id, db_connection)
    return "Delete successful"

@router.get("/get/{program_id}")
def getCourse(program_id: str, db_connection: Session = Depends(get_db), _: None = checkRole(["admin", "student"])):
    return courses_func.getCoursebyProgram(program_id, db_connection)