from db.firestore import fs
from schema.programs_schema import Program
#--------------------------Firestore Functions--------------------------
def addProgram(program: Program):
    colctn = fs.collection("programs")
    prgm_dict = program.model_dump()

    prgm_id = prgm_dict["program_id"]
    del prgm_dict["program_id"]

    colctn.document(prgm_id).set(prgm_dict)

    return prgm_dict

    

def getProgramFirestore():
    docs = fs.collection("programs").stream()
    ids = [{"id": doc.id, "name": doc.to_dict()["name"], "specialization": doc.to_dict()["specialization"]} for doc in docs]

    return ids
