from sqlalchemy import String, Integer, Column, ForeignKey
from models.programs_model import Program
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"

    student_id = Column(String(12), primary_key=True, nullable=False)
    student_email = Column(String(255), nullable=False)
    student_dept = Column(String(255), nullable=False)
    program_id = Column(String(10), ForeignKey(Program.program_id), nullable=False)
    student_f_name = Column(String(30), nullable=False)
    student_l_name = Column(String(30), nullable=False)
    student_m_name = Column(String(30))
    student_year = Column(Integer, nullable=False)
