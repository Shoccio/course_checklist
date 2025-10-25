from db.firestore import fs

#--------------------------Firestore Functions--------------------------
def getProgramFirestore():
    docs = fs.collection("programs").stream()

    ids = [doc.id for doc in docs]

    return ids
