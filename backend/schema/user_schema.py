from pydantic import BaseModel

class RequestedPass(BaseModel):
    newPass:        str

class User(BaseModel):
    login_id:       str
    hashed_pass:    str
    role:           str