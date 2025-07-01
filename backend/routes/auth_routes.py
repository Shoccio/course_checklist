from functions.auth_func import login, getCurrentUser
from functions import user_func
from db.db import get_db
from models.user_model import User
from schema.user_schema import RequestedPass
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/login")
def logginIn(user: OAuth2PasswordRequestForm = Depends(), db_connection: Session = Depends(get_db)):
    token = login(user.username, user.password, db_connection)
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key= "access_token",
        value= token,
        httponly=True,
        secure=False,
        samesite="none",        # VERY IMPORTANT | TURN IT ON WHEN IN ACTUAL PRODUCTION
        path="/"
    )

    return response

@router.post("/editPassword/{student_id}")
def editPassword(student_id: str, newPass: RequestedPass, 
                 db_connection: Session = Depends(get_db), curUser: User = Depends(getCurrentUser)):
    if curUser.login_id != student_id and curUser.role.value == "admin":
        return {"Error: Invalid User"}
    
    return user_func.editPass(student_id, newPass.newPass, db_connection)

