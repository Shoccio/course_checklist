from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from db.db import get_db
from models.user_model import User
from passlib.context import CryptContext
from sqlalchemy.orm import Session, load_only
from jose import JWTError, jwt
from datetime import timedelta
import datetime

pwd_contx = CryptContext(schemes=['bcrypt'])

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def login(user_id: str, passwd: str, db_connection: Session):
    user_pass = db_connection.query(User).filter(User.login_id == user_id).options(load_only(User.hashed_pass, User.role)).one()

    if not pwd_contx.verify(passwd, user_pass.hashed_pass):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong ID/Password")
    
    token = createToken({"sub": user_id}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    return {
        "access_token": token,
        "token_type":   "bearer",
        "student_id":   user_id
    }

def createToken(user: dict, expire: timedelta | None = None):
    to_encode = user.copy()

    if expire:
        expr = datetime.datetime.now(datetime.timezone.utc) + expire
    else:
        expr = datetime.datetime.now(datetime.timezone.utc) + timedelta(15)
    to_encode.update({"exp": expr})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def getCurrentUser(db_connection: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    try:
        jwt_decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        login_id = jwt_decoded.get("sub")
        
        user = db_connection.query(User).filter(User.login_id == login_id).first()
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Failed Token Decode")
    
    return user

def getCurrentUserRole(user: User = Depends(getCurrentUser)):
    return user.role.value

def checkRole(roles: list[str]):
    def checker(role: str = Depends(getCurrentUserRole)):
        if role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "User is not authorized to do current action")
        
    return Depends(checker)