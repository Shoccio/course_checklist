import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud.firestore_v1.client import Client

cred = credentials.Certificate(r"credentials\course-title-firebase-adminsdk-fbsvc-155d010eef.json")
firebase_admin.initialize_app(cred)

fs = firestore.client()
