import React, { useEffect, useRef, useState } from "react";
import style from "../style/programlist.module.css";
import HeaderWebsite from "../component/header";
import LoadingOverlay from "../component/loadingOverlay";
import axios from "axios";

import { API_URL } from "../misc/url";

import CoursesTable from "../component/course_list/courses_table";

export default function CourseList() {
  const pageName = "Course List";

  const [courses, setCourses] = useState([])

  useEffect(() => {
    getCourses();
  }, [])

  const getCourses = async () => {
    await axios.get(API_URL + `/course/getAll`)
    .then((res) => {
        setCourses(res.data);
    })
    .catch((err) =>{
      console.log(err);
    });
  };

  return (
    <div className={style.programChecklist}>
      <HeaderWebsite pageName={pageName} />
      <div className={style.courseBody}>

        <div className={style.programDetail}>
            <CoursesTable courses={courses} onCourseAdded={getCourses} />

        </div>
      </div>
    </div>
  );
}