from schema.course_schema import CourseSchema 
from functions.program_course_func import updateOrder
from fastapi import HTTPException, status

from db.firestore import fs

#--------------------------Firestore Functions--------------------------
def addCourse(course: CourseSchema):
    course_collection = fs.collection("courses")

    course_dict = course.__dict__
    course_id = course_dict["course_id"]
    course_dict.pop("course_id")

    course_collection.document(course_id).set(course_dict)

def editCourse(course: CourseSchema, course_id: str):
    course_collection = fs.collection("courses")

    course_dict = course.__dict__
    new_id = course_dict["course_id"]
    course_dict.pop("course_id")

    old_course = course_collection.document(course_id)

    if not old_course.get().exists:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Course does not exist")
    
    old_course.delete()
    course_collection.document(new_id).set(course_dict)

def deleteCourse(course_id: str):
    course_collection = fs.collection("courses")

    course = course_collection.document(course_id)

    if not course.get().exists:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Course does not exist")
    
    course.delete()

def updateCourses(program_id: str, courses: list[CourseSchema]):
    program_courses_collection = fs.collection("program_course")
    courses_collection = fs.collection("courses")

    courses_ids = [course.course_id for course in courses]
    new_courses = []

    courses_docs = list(program_courses_collection.where("program_id", "==", program_id).stream())
    courses_map = {course.to_dict()["course_id"]: course.reference for course in courses_docs}


    batch = fs.batch()
    chunk_size = 500

    for index, course_data in enumerate(courses):
        if not course_data.id in courses_map:
            course_ref = courses_collection.document()
            prog_course_ref = program_courses_collection.document()

            batch.set(prog_course_ref, {"program_id": program_id, "course_id": course_data.id, "sequence": index})
            batch.set(course_ref, course_data.model_dump())
            new_courses.append({course_data.id: course_ref})
        else:
            course_ref = courses_map[course_data.id].get().to_dict()["reference"]
            batch.set(course_ref, course_data.model_dump(), merge = True)

        if (index + 1) % chunk_size == 0:
            batch.commit()
            batch = fs.batch()

    batch.commit()

    updateOrder(program_id, courses_ids)
    addCourseStudent(course_ids)



