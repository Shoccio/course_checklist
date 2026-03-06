from fastapi import APIRouter
from schema.programs_schema import Program
from functions import program_func

router = APIRouter()

@router.get("/get")
def getPrograms():
    return program_func.getProgramFirestore()

@router.post("/add")
def addProgram(program: Program):
    return program_func.addProgram(program)