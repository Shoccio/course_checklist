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
    fields_to_check = list(CourseSchema.model_fields.keys())
    courses_dict = {course.model_dump()["course_id"]: course.model_dump() for course in courses}

    program_courses_collection = fs.collection("program_course")
    courses_collection = fs.collection("courses")
    student_courses_collection = fs.collection("student_courses")

    """
    checkCourses(fields_to_check, courses_dict, courses_collection)
    checkCollection(fields_to_check, courses_dict, program_courses_collection)
    checkCollection(fields_to_check, courses_dict, student_courses_collection)
"""


def checkCourses(fields: list[str], courses: dict, collection):
    batch = fs.batch()
    batch_size = 500

    for index, course in enumerate(courses.values()):
        course_ref = collection.document(course["course_id"])

        course_dict = course_ref.get().to_dict()

        if not course_dict:
            print(f"Missing course: {course['course_id']}")
            continue

        changes = {field: course[field] for field in fields
                   if course[field] != course_dict.get(field)}
        
        if not changes:
            continue
        
        batch.update(course_ref, changes)

        if (index + 1) % batch_size == 0:
            batch.commit()
            batch = fs.batch()

    batch.commit()
        

def checkCollection(fields: list[str], courses:dict, collection):
    batch = fs.batch()
    batch_size = 500
    index = 0

    for course in courses.values():
        course_list = list(collection.where("course_id", "==", course["course_id"]).stream())

        if not course_list:
            print(f"Missing course: {course['course_id']}")
            continue

        first_entry = course_list[0].to_dict()

        changes = {field: course[field] for field in fields
                   if course[field] != first_entry.get(field)}
        
        if not changes:
            continue

        for entry in course_list:
            batch.update(entry.reference, changes)
            index += 1

            if (index) % batch_size == 0:
                batch.commit()
                batch = fs.batch()
                index = 0

    batch.commit()
            
        




