from sqlalchemy import String, Column
from sqlalchemy.ext.declarative import declarative_base

base = declarative_base()

class Program(base):
    __tablename__ = "programs"

    program_id = Column(String(10), primary_key=True)
    program_name = Column(String(255), nullable=False)
    specialization = Column(String(255))