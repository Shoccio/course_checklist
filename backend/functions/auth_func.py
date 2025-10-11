from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status, Cookie, Request
from db.db import get_db
from models.user_model import User
from passlib.context import CryptContext
from sqlalchemy.orm import Session, load_only
from sqlalchemy.exc import SQLAlchemyError
from jose import JWTError, jwt
from datetime import timedelta
import datetime

from db.firestore import fs

pwd_contx = CryptContext(schemes=['bcrypt'])

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def login_firestore(user_id: str, passwd: str):
    user_collection = fs.collection("users")

    user = user_collection.document(user_id).get()

    if not user.exists:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    
    user = user.to_dict()

    if not pwd_contx.verify(passwd, user["hashed_pass"]):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong ID/Password")
    
    #token = createToken({"sub": user_id}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    return {
        #"access_token": token,
        "token_type":   "bearer",
        "student_id":   user_id,
        "role":         user["role"]
    }

def login(db_connection: Session, user_id: str, passwd: str):
    try:
        user_pass = db_connection.query(User).filter(User.login_id == user_id).options(load_only(User.hashed_pass, User.role)).one()

        if not pwd_contx.verify(passwd, user_pass.hashed_pass):
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong ID/Password")
        
        token = createToken({"sub": user_id}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

        return {
            "access_token": token,
            "token_type":   "bearer",
            "student_id":   user_id,
            "role":         user_pass.role
        }
    except SQLAlchemyError:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong ID/Password")

def createToken(user: dict, expire: timedelta | None = None):
    to_encode = user.copy()

    if expire:
        expr = datetime.datetime.now(datetime.timezone.utc) + expire
    else:
        expr = datetime.datetime.now(datetime.timezone.utc) + timedelta(15)
    to_encode.update({"exp": expr})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def getCurrentUser(request: Request, db_connection: Session = Depends(get_db)):
    token = request.cookies.get("access_token")

    if token is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="No token found in cookies")

    try:
        jwt_decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        login_id = jwt_decoded.get("sub")

        if not login_id:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
        
        user = db_connection.query(User).filter(User.login_id == login_id).first()
        
        if not user:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
        return user

    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Failed to decode token")


def getCurrentUserRole(user: User = Depends(getCurrentUser)):
    return user.role.value

def checkRole(roles: list[str]):
    def checker(role: str = Depends(getCurrentUserRole)):
        if role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "User is not authorized to do current action")
        
        return role
        
    return Depends(checker)