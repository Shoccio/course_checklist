from db.firestore import fs

def getCourseByProgram(program_id: str):
    program_courses_collection = fs.collection("program_course")

    courses = program_courses_collection.document(program_id).collection("courses").stream()

    courses_dict = [course.to_dict() for course in courses]

    return courses_dict

def updateOrder(program_id: str, course_ids: list[str]):
    program_courses_collection = fs.collection("program_course")

    courses = list(program_courses_collection.where("program_id", "==", program_id).stream())

    course_map = {doc.to_dict["course_id"]: doc.reference for doc in courses}

    batch = fs.batch()
    chunk_size = 500

    for index, course_id in enumerate(course_ids):
        if course_id in course_map:
            batch.update(course_map[course_id], {"sequence": index})
        else:
            reference = program_courses_collection.document()

        if (index + 1) % chunk_size == 0:
            batch.commit()
            batch = fs.batch()

    batch.commit()

