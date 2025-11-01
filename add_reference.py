import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.client import Client

cred = credentials.Certificate(r"backend\credentials\course-title-firebase-adminsdk-fbsvc-155d010eef.json")
firebase_admin.initialize_app(cred)

fs = firestore.client()

SC_collection = fs.collection("student_courses").stream()
program_collection = fs.collection("courses")
PC_collection = fs.collection("program_course")

batch = fs.batch()
chunk_size = 500

for index, SC in enumerate(SC_collection):
    course_id = SC.to_dict()["course_id"]
    course_query = PC_collection.where("course_id", "==", course_id).stream()

    course_doc = next(course_query, None)

    batch.update(SC.reference, {"reference": course_doc.reference})

    if (index + 1) % 500 == 0:
        batch.commit()
        batch = fs.batch()

batch.commit()


