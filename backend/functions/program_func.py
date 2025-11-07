from db.firestore import fs

#--------------------------Firestore Functions--------------------------
def getProgramFirestore():
    docs = fs.collection("programs").stream()
    ids = [{"id": doc.id, "name": doc.to_dict()["name"], "specialization": doc.to_dict()["specialization"]} for doc in docs]

    return ids
