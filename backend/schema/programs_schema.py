from pydantic import BaseModel

class Program(BaseModel):
    program_id:         str
    name:               str
    specialization:     str