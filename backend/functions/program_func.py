from db.firestore import fs

#--------------------------Firestore Functions--------------------------
def getProgramFirestore():
    docs = fs.collection("programs").stream()

    ids = [doc.to_dict()["id"] for doc in docs]

    return ids
