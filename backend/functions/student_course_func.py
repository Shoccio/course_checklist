# functions/student_course_func.py
from fastapi import HTTPException, status
from db.firestore import fs
from math import ceil

def addEntry(student_id: str, program_id: str):
    courses_collection = fs.collection("program_course")
    SC_collection = fs.collection("student_courses")

    courses = courses_collection.where("program_id", "==", program_id).stream()

    student_course = [
        {
            "student_id": student_id,
            "course_id": course.to_dict()["course_id"],
            "grade": None,
            "remark": ""
        }
        for course in courses
    ]

    chunk_size = 500

    for chunk in range(ceil(len(student_course) / chunk_size)):
        batch = fs.batch()

        for i in student_course[chunk * chunk_size : (chunk + 1) * chunk_size]:
            doc_ref = SC_collection.document()
            batch.set(doc_ref, i)

        batch.commit()

def deleteCourses(course_id: str):
    SC_collection = fs.collection("student_courses")

    courses = list(SC_collection.where("course_id", "==", course_id).stream())

    if len(courses) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Course not found")
    
    chunk_size = 500

    for chunk in range(ceil(len(courses) / chunk_size)):
        batch = fs.batch()

        for course in courses[chunk * chunk_size : (chunk + 1) * chunk_size]:
            batch.delete(course.reference)

        batch.commit()

def deleteStudent(student_id: str):
    SC_collection = fs.collection("student_courses")

    student_courses = list(SC_collection.where("student_id", "==", student_id))

    if len(student_courses) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Student not found")
    
    chunk_size = 500

    for chunk in range(ceil(len(student_courses) / 4)):
        batch = fs.batch()

        for course in student_courses[chunk * chunk_size : (chunk + 1) * chunk_size]:
            batch.delete(course)

        batch.commit()
    
def getStudentCourses(student_id: str, program_id: str):
    SC_collection = fs.collection("student_courses")

    student_courses = list(SC_collection.where("student_id", "==", student_id).stream())

    if len(student_courses) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Student not found")
    
    courses = []

    for course in student_courses:
        student_course_dict = course.to_dict()

        program_course_ref = student_course_dict["reference"]
        program_course_doc = program_course_ref.get()
        program_course_dict = program_course_doc.to_dict()

        course_ref = program_course_dict["reference"]
        course_doc = course_ref.get()
        course_dict = course_doc.to_dict()

        courses.append({ "course_id": student_course_dict["course_id"],
                        "course_name": course_dict["course_name"],
                        "course_units": course_dict["course_units"],
                        "year": course_dict["course_year"],
                        "semester": course_dict["course_sem"],
                        "grade": student_course_dict["grade"],
                        "remark": student_course_dict["remark"] or "N/A"
                        })
        
        return courses

def getGWA(courses):
    total_weighted = 0
    total_units = 0

    for course in courses:
        grade = course.get("grade")
        units = course.get("course_units")
        remark = course.get("remark", "")

        if grade is not None and remark == "Passed":
            total_weighted += grade * units
            total_units += units

    if total_units == 0:
        return 0.0  # or 0.0, or "N/A", depending on your app

    return round(total_weighted / total_units, 4)  # Rounded to 4 decimal places

def updateGrades(course_id: str, student_id, grade: float):
    if grade == -1.0:
        grade = None

    student_course_collection = fs.collection("student_courses")

    course = list(student_course_collection.where("course_id", "==", course_id).where("student_id", "==", student_id).stream())

    if len(course) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Student/Course not found")
    
    course[0].update({"grade": grade})

    