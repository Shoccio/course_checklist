from sqlalchemy import String, ForeignKey, Column, Integer
from sqlalchemy.ext.declarative import declarative_base
from models.course_model import Course
from models.programs_model import Program

base = declarative_base()

class Program_Courses(base):
    __tablename__ = "program_courses"

    course_id = Column(String(30), ForeignKey(Course.course_id), primary_key=True, nullable=False)
    program_id = Column(String(30), ForeignKey(Program.program_id), primary_key=True, nullable=False)
    sequence = Column(Integer, nullable=False)