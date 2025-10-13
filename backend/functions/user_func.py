from sqlalchemy.orm import Session, load_only
from sqlalchemy.exc import SQLAlchemyError
from passlib.context import CryptContext
from models import user_model as us_m
from fastapi import HTTPException, status

from db.firestore import fs

pwd_contx = CryptContext(schemes=['bcrypt'])

#--------------------------Firestore Functions--------------------------
def addUserFirestore(loginID: str, password: str):
    user_collection = fs.collection("users")

    hash_pass = pwd_contx.hash(password)
    user_collection.document(loginID).set({"hashed_pass": hash_pass, "role": "student"})


'''
def editLoginIDFirestore(loginID: str, oldID: str):
    user_collection = fs.collection("users")

    user = fs.document(oldID)

    if not user.get():
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    user_collection.document(loginID).set(user.get().to_dict())

    user.delete()
'''
def editPassFirestore(loginID: str, new_pass: str):
    user_collection = fs.collection("users")

    hash_pass = pwd_contx.hash(new_pass)

    user = user_collection.document(loginID)

    if not user.get().exists:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    user.update({"hashed_pass": hash_pass})

def deleteUserFirestore(loginID: str):
    user_collection = fs.collection("users")

    user = user_collection.document(loginID)

    if not user.get().exists:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
       
    user.delete()

