from functions import curriculum_func
from fastapi import APIRouter

router = APIRouter()

#--------------------------Firestore Functions--------------------------
@router.get("/get/{program_id}")
def getPrgmCurr(program_id: str):
    return curriculum_func.getPrgmCurr(program_id)