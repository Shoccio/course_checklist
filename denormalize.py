import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.client import Client
from google.cloud.firestore import DELETE_FIELD

cred = credentials.Certificate(r"backend\credentials\course-title-firebase-adminsdk-fbsvc-155d010eef.json")
firebase_admin.initialize_app(cred)

fs = firestore.client()

SC_collection = fs.collection("student_courses").stream()
courses_collection = fs.collection("courses")
PC_collection = fs.collection("program_course")



batch = fs.batch()
chunk_size = 500


for index, SC in enumerate(SC_collection):
    course_id = SC.to_dict()["course_id"]

    PC_query = PC_collection.where("course_id", "==", course_id).stream()
    PC_doc = next(PC_query, None)
    PC_dict = PC_doc.to_dict()

    if PC_dict:
        batch.update(SC.reference, {**PC_dict, "reference": DELETE_FIELD})
    else:
        print(course_id)


    if (index + 1) % 500 == 0:
        batch.commit()
        batch = fs.batch()

batch.commit()


