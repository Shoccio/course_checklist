import React, { useState, useEffect } from "react";
import style from "../style/searchbar.module.css";

export default function StudentSearchBar({ onSelectStudent, students = [] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const filtered = students.filter((student) => {
        const fullName = `${student.student_f_name} ${student.student_l_name}`.toLowerCase();
        return (
          student.student_id.toLowerCase().includes(query.toLowerCase()) ||
          fullName.includes(query.toLowerCase())
        );
      });

      setResults(filtered);
      setShowDropdown(filtered.length > 0);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, students]);

  const handleSelect = (student) => {
    onSelectStudent(student.student_id);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className={style.searchContainer}>
      <input
        className={style.searchBar}
        type="text"
        placeholder="SEARCH STUDENT..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results?.length > 0 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      />
      {showDropdown && results?.length > 0 && (
        <ul className={style.dropdown}>
          {results.map((student, index) => (
            <li
              key={index}
              className={style.dropdownItem}
              onMouseDown={() => handleSelect(student)}
            >
              {student.student_id} – {student.student_l_name},{" "}
              {student.student_f_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
