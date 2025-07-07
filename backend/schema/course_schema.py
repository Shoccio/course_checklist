from pydantic import BaseModel

class CourseSchema(BaseModel):
    course_id:      str
    course_name:    str
    course_hours:   int
    course_units:   int
    course_preq:    str | None
    course_year:    int
    course_sem:     int
    units_lec:      int
    units_lab:      int
    hours_lec:      int
    hours_lab:      int
    sequence:       int