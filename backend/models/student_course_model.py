from sqlalchemy import String, Integer, ForeignKey, Column
from sqlalchemy.ext.declarative import declarative_base
from models.student_model import Student
from models.course_model import Course

base = declarative_base()

class Student_Course(base):
    __tablename__ = "students_courses"

    student_id = Column(String(12), ForeignKey(Student.student_id), primary_key=True)
    course_id = Column(String(30), ForeignKey(Course.course_id), primary_key=True)
    grade = Column(Integer)
    remarks = Column(String(255))