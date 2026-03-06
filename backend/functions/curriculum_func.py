from db.firestore import fs

def getPrgmCurr(program_id: str):
    curr_col = fs.collection("curriculum")

    curr_docs = list(curr_col.where("program_id", "==", program_id).stream())
    
    curriculums = [curr.to_dict() for curr in curr_docs]


    return curriculums