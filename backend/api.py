from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.courses_routes import router as course_router
from routes.students_routes import router as student_router
from routes.auth_routes import router as auth_router

origins = [
    "http://localhost:3000"
]

app = FastAPI()
app.include_router(course_router, prefix="/course", tags=["course"])
app.include_router(auth_router, prefix="/auth", tags=["authentication"])
app.include_router(student_router, prefix="/student", tags=["student"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"message": "Hello World"}
