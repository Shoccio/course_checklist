from sqlalchemy import Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Course(Base):
    __tablename__ = "courses"

    course_id = Column(String(30), primary_key=True)
    course_name = Column(String(255), nullable=False)
    course_hours = Column(Integer, nullable=False)
    course_units = Column(Integer, nullable=False)
    course_preq = Column(String(255), nullable=False)
    course_year = Column(Integer, nullable=False)
    course_sem = Column(Integer, nullable=False)
    units_lec = Column(Integer, nullable=False)
    units_lab = Column(Integer, nullable=False)
    hours_lec = Column(Integer, nullable=False)
    hours_lab = Column(Integer, nullable=False)
    sequence = Column(Integer, nullable=False)