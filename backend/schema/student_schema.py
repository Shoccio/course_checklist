from pydantic import BaseModel

class Student(BaseModel):
    student_id:         str
    student_email:      str
    student_dept:       str
    program_id:         str
    student_f_name:     str
    student_l_name:     str
    student_m_name:     str | None
    student_year:       int
    student_status:     str

