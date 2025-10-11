from pydantic import BaseModel

class Student(BaseModel):
    id:             str
    email:          str
    dept:           str
    program_id:     str
    f_name:         str
    l_name:         str
    m_name:         str | None
    year:           int
    is_regular:     bool

