from fastapi import FastAPI
from routes.courses_routes import router as course_router
from routes.students_routes import router as student_router
from routes.auth_routes import router as auth_router

app = FastAPI()
app.include_router(course_router, prefix="/course", tags=["course"])
app.include_router(auth_router, prefix="/auth", tags=["authentication"])
app.include_router(student_router, prefix="/student", tags=["student"])

@app.get("/")
def root():
    return {"message": "Hello World"}
