from db.firestore import fs
from schema.curriculum_schema import Curriculum

def getPrgmCurr(program_id: str):
    curr_col = fs.collection("curriculum")

    curr_docs = list(curr_col.where("program_id", "==", program_id).stream())
    
    curriculums = [curr.to_dict() for curr in curr_docs]


    return curriculums

def addCurr(curr: Curriculum):
    col = fs.collection("curriculum")

    data = curr.model_dump()

    col.document().set(data)

    return "Succesful"