from functions import courses_func
from functions.program_course_func import getCourseByProgram
from functions.auth_func import checkRole
from schema.course_schema import CourseSchema
from fastapi import APIRouter, Depends

router = APIRouter()

#--------------------------Firestore Functions--------------------------
@router.post("/add")
def addCourse(course: CourseSchema, role: str = checkRole(["admin"])):
    courses_func.addCourseFirestore(course)
    return {"message": "Course add successful"}

@router.put("/edit/{course_id}")
def editCourse(course: CourseSchema, course_id: str, role: str = checkRole(["admin"])):
    courses_func.editCourseFirestore(course, course_id)
    return {"message": "Course edited succesful"}

@router.delete("/delete/{course_id}")
def deleteCourse(course_id: str, role: str = checkRole(["admin"])):
    courses_func.deleteCourseFirestore(course_id)
    return {"message": "Course deleted succesful"}

@router.put("/update/{program_id}")
def updateCourses(program_id: str, course: list[CourseSchema],  role: str = checkRole(["admin"])):
    return courses_func.updateCourses(program_id, course)

@router.get("/get/{program_id}")
def getCourse(program_id: str, role: str = checkRole(["admin", "student"])):
    return getCourseByProgram(program_id)