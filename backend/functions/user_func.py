from sqlalchemy.orm import Session, load_only
from passlib.context import CryptContext
from models import user_model as us_m

pwd_contx = CryptContext(schemes=['bcrypt'])

def addUser(loginID: str, db_session: Session):
    hash_pass = pwd_contx.hash(loginID)
    user = us_m.User( login_id = loginID, hashed_pass = hash_pass, role = us_m.Role.student)

    db_session.add(user)

def editLoginId(loginID: str, oldId: str, db_session: Session):
    user = db_session.query(us_m.User).filter_by(login_id = oldId).options(load_only(us_m.User.login_id)).one()
    user.login_id = loginID

def editPass(loginID: str, new_pass: str, db_session: Session):
    hash_pass = pwd_contx.hash(new_pass)
    user = db_session.query(us_m.User).filter_by(login_id = loginID).options(load_only(us_m.User.hashed_pass)).one()

    user.hashed_pass = hash_pass

    db_session.commit()

def deleteUser(loginID: str, db_session:Session):
    user = db_session.query(us_m.User).filter_by(login_id = loginID).one()

    db_session.delete(user)