from pydantic import BaseModel

class CourseSchema(BaseModel):
    id:      str
    name:    str
    hours:   int
    units:   int
    preq:    str | None
    year:    int
    sem:     int
    units_lec:      int
    units_lab:      int
    hours_lec:      int
    hours_lab:      int
    sequence:       int