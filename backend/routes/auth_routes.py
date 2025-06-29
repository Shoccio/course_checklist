from functions import auth_func as auth
from functions import user_func
from db.db import get_db
from models.user_model import User
from schema.user_schema import RequestedPass
from fastapi import APIRouter, Depends, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/login")
def login(user: OAuth2PasswordRequestForm = Depends(), db_connection: Session = Depends(get_db)):
    return auth.login(user.username, user.password, db_connection)

@router.post("/editPassword/{student_id}")
def editPassword(student_id: str, newPass: RequestedPass, 
                 db_connection: Session = Depends(get_db), curUser: User = Depends(auth.getCurrentUser)):
    if student_id != curUser.login_id:
        return {"Not the user"}
    
    return user_func.editPass(student_id, newPass.newPass, db_connection)

