from db.firestore import fs
from fastapi import APIRouter
from schema.course_curr_schema import CourseCurr

router = APIRouter()

def getCurrCourse(curriculum: str):
    CurrCourse_collection = fs.collection("curriculum_course")

    docs = list(CurrCourse_collection.where("curriculum", "==", curriculum).stream())

    courses = [course.to_dict() for course in docs]

    return courses

def addCourse(course: CourseCurr):
    collection = fs.collection("curriculum_course")

    course_dict = course.__dict__
    course_id = course_dict["course_id"]

    collection.document(course_id).set(course_dict)

    return "Add Succesfull"
def deleteCourse(course_id: str, curriculum: str):
    collection = fs.collection("curriculum_course")
    
    # Find and delete the course document for the specific curriculum
    docs = list(collection.where("course_id", "==", course_id).where("curriculum", "==", curriculum).stream())
    
    for doc in docs:
        doc.reference.delete()
    
    return "Delete Successful"