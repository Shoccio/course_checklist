import enum
from sqlalchemy import Integer, String, Enum, Column
from sqlalchemy.ext.declarative import declarative_base

base = declarative_base()

class Role(enum.Enum):
    student = "student"
    admin = "admin"

class User(base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    login_id = Column(String(30), nullable=False, unique=True)
    hashed_pass = Column(String(255), nullable=False)
    role = Column(Enum(Role), nullable=False)