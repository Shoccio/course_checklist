from pydantic import BaseModel

class Program(BaseModel):
    program_id:         str
    program_name:       str
    specialization:     str