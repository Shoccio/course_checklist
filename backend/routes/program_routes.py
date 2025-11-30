from fastapi import APIRouter
from functions.program_func import  getProgramFirestore
from functions.auth_func import checkRole

router = APIRouter()

@router.get("/get")
def getPrograms(role: str = checkRole(["admin", "student"])):
    return getProgramFirestore()