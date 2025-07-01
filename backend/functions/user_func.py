from sqlalchemy.orm import Session, load_only
from sqlalchemy.exc import SQLAlchemyError
from passlib.context import CryptContext
from models import user_model as us_m
from fastapi import HTTPException, status

pwd_contx = CryptContext(schemes=['bcrypt'])

def addUser(loginID: str, db_session: Session):
    hash_pass = pwd_contx.hash(loginID)
    user = us_m.User( login_id = loginID, hashed_pass = hash_pass, role = us_m.Role.student)

    db_session.add(user)

def editLoginId(loginID: str, oldId: str, db_session: Session):
    user = db_session.query(us_m.User).filter_by(login_id = oldId).options(load_only(us_m.User.login_id)).first()
    
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    user.login_id = loginID

def editPass(loginID: str, new_pass: str, db_session: Session):
    hash_pass = pwd_contx.hash(new_pass)
    try:
        user = db_session.query(us_m.User).filter_by(login_id = loginID).options(load_only(us_m.User.hashed_pass)).first()

        if not user:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

        user.hashed_pass = hash_pass

        db_session.commit()
    except SQLAlchemyError:
        db_session.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Error occured editing password")

def deleteUser(loginID: str, db_session:Session):
    user = db_session.query(us_m.User).filter_by(login_id = loginID).one()

    db_session.delete(user)