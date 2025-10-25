from schema.student_schema import Student
from functions.user_func import addUser
from functions.student_func import addStudent
from functions.student_course_func import addEntry


def addStudentHelper(student: Student):
    #add user
    addUser(student.id, student.id)
    #add student
    addStudent(student)
    #add their courses
    addEntry(student.id, student.program_id)


