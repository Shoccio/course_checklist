from functions.auth_func import login, getCurrentUser
from functions import user_func
from db.db import get_db
from models.user_model import User
from schema.user_schema import RequestedPass
from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/login")
def logginIn(user: OAuth2PasswordRequestForm = Depends(), db_connection: Session = Depends(get_db)):
    auth = login(user.username, user.password, db_connection)  # returns a dict

    token = auth["access_token"]

    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=token,  # ✅ Just the JWT string
        httponly=True,
        secure=True,
        samesite="none",  # set True in production if on HTTPS
        path="/"
    )

    return response

@router.post("/logout")
def logOut(response: Response):
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("access_token", path="/")
    return response

@router.post("/editPassword/{student_id}")
def editPassword(student_id: str, newPass: RequestedPass, 
                 db_connection: Session = Depends(get_db), curUser: User = Depends(getCurrentUser)):
    if curUser.login_id != student_id and curUser.role.value == "admin":
        return {"Error: Invalid User"}
    
    return user_func.editPass(student_id, newPass.newPass, db_connection)

