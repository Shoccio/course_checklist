from functions import curriculum_course_func
from schema.course_curr_schema import CourseCurr, DeleteCourseCurr
from fastapi import APIRouter

router = APIRouter()

#--------------------------Firestore Functions--------------------------
@router.get("/get_courses")
def getCurrCourses(curriculum: str):
    return curriculum_course_func.getCurrCourse(curriculum)

@router.post("/add-course")
def addCourse(course: CourseCurr):
    return curriculum_course_func.addCourse(course)

@router.post("/delete-course")
def deleteCourse(course: DeleteCourseCurr):
    return curriculum_course_func.deleteCourse(course.course_id, course.curriculum)
