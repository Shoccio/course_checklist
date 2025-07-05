import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaPencilAlt, FaGripVertical, FaTrash, FaPlus } from "react-icons/fa";
import style from "../style/draggable.module.css";

function ordinal(n) {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function SortableRow({
  course,
  isTableEditing,
  isRowEditing,
  onRowEditClick,
  onRowSaveClick,
  onRowDeleteClick,
  onFieldChange,
  disableDrag,
}) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: course.course_id });

  const isLab = course.course_id.trim().toLowerCase().endsWith("l");

  const rowStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={rowStyle} className={style.defaultRow}>
      <td>
        {isRowEditing ? (
          <input
            type="text"
            value={course.course_id}
            onChange={(e) => onFieldChange("course_id", e.target.value)}
          />
        ) : (
          course.course_id
        )}
      </td>

      <td>
        {isRowEditing ? (
          <input
            type="text"
            value={course.course_name}
            onChange={(e) => onFieldChange("course_name", e.target.value)}
          />
        ) : (
          course.course_name
        )}
      </td>

      <td>
        {isRowEditing ? (
          <input
            type="number"
            value={!isLab ? course.course_hours : 0}
            onChange={(e) =>
              onFieldChange("course_hours", isLab ? 0 : +e.target.value)
            }
          />
        ) : (
          !isLab ? course.course_hours : 0
        )}
      </td>

      <td>
        {isRowEditing ? (
          <input
            type="number"
            value={isLab ? course.course_hours : 0}
            onChange={(e) =>
              onFieldChange("course_hours", isLab ? +e.target.value : 0)
            }
          />
        ) : (
          isLab ? course.course_hours : 0
        )}
      </td>

      <td>
        {isRowEditing ? (
          <input
            type="number"
            value={!isLab ? course.course_units : 0}
            onChange={(e) =>
              onFieldChange("course_units", isLab ? 0 : +e.target.value)
            }
          />
        ) : (
          !isLab ? course.course_units : 0
        )}
      </td>

      <td>
        {isRowEditing ? (
          <input
            type="number"
            value={isLab ? course.course_units : 0}
            onChange={(e) =>
              onFieldChange("course_units", isLab ? +e.target.value : 0)
            }
          />
        ) : (
          isLab ? course.course_units : 0
        )}
      </td>

      <td>
        {isRowEditing ? (
          <input
            type="text"
            value={course.course_preq || ""}
            onChange={(e) => onFieldChange("course_preq", e.target.value)}
          />
        ) : (
          course.course_preq
        )}
      </td>

      {isTableEditing && (
        <td className={style.actionCell}>
          {isRowEditing ? (
            <button onClick={onRowSaveClick}>Save</button>
          ) : (
            <span
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              <FaPencilAlt
                style={{ cursor: "pointer" }}
                title="Edit Row"
                onClick={onRowEditClick}
              />
              {!disableDrag && (
                <FaGripVertical
                  ref={setActivatorNodeRef}
                  {...attributes}
                  {...listeners}
                  className={style.dragHandle}
                  title="Drag"
                />
              )}
              <FaTrash
                style={{ cursor: "pointer", color: "red" }}
                title="Delete Row"
                onClick={onRowDeleteClick}
              />
            </span>
          )}
        </td>
      )}
    </tr>
  );
}

export default function ProgramTable({ courses, isEditing, onReorder = () => {} }) {
  const [localCourses, setLocalCourses] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);

  useEffect(() => {
    setLocalCourses([...courses]);
  }, [courses]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = localCourses.findIndex((c) => c.course_id === active.id);
    const newIndex = localCourses.findIndex((c) => c.course_id === over.id);

    const reordered = arrayMove(localCourses, oldIndex, newIndex);

    setLocalCourses(reordered);
    onReorder(reordered);
  };

  const handleFieldChange = (id, field, value) => {
    setLocalCourses((prev) =>
      prev.map((c) => (c.course_id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleRowDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this course?");
    if (confirmed) {
      setLocalCourses((prev) => prev.filter((c) => c.course_id !== id));
    }
  };

  const handleAddCourseBelow = (year, sem) => {
    const newId = `new-${Date.now()}`;
    const newCourse = {
      course_id: "",
      course_name: "",
      course_year: year,
      course_sem: sem,
      course_hours: 0,
      course_units: 0,
      course_preq: "",
    };

    // find index of last course in this year+sem group
    const insertIndex = localCourses.reduce((idx, c, i) => {
      if (c.course_year === year && c.course_sem === sem) return i;
      return idx;
    }, -1);

    const updated = [
      ...localCourses.slice(0, insertIndex + 1),
      { ...newCourse, course_id: newId },
      ...localCourses.slice(insertIndex + 1),
    ];

    setLocalCourses(updated);
    setEditingRowId(newId);
  };

  const rows = [];

  let prevYear = null;
  let prevSem = null;

  localCourses.forEach((course) => {
    if (course.course_year !== prevYear || course.course_sem !== prevSem) {
      rows.push(
        <tr
          key={`header-${course.course_year}-${course.course_sem}`}
          className={style.yearSem}
        >
          <td colSpan="8" style={{ fontWeight: "bold" }}>
            {ordinal(course.course_year)} Year, {ordinal(course.course_sem)} Sem
            {isEditing && (
              <FaPlus
                style={{ cursor: "pointer", color: "green", marginLeft: "1rem" }}
                title="Add course to this semester"
                onClick={() => handleAddCourseBelow(course.course_year, course.course_sem)}
              />
            )}
          </td>
        </tr>
      );

      prevYear = course.course_year;
      prevSem = course.course_sem;
    }

    rows.push(
      <SortableRow
        key={course.course_id}
        course={course}
        isTableEditing={isEditing}
        isRowEditing={editingRowId === course.course_id}
        onRowEditClick={() =>
          setEditingRowId(editingRowId === course.course_id ? null : course.course_id)
        }
        onRowSaveClick={() => setEditingRowId(null)}
        onRowDeleteClick={() => handleRowDelete(course.course_id)}
        onFieldChange={(field, value) =>
          handleFieldChange(course.course_id, field, value)
        }
        disableDrag={!isEditing}
      />
    );
  });

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={localCourses.map((c) => c.course_id)}
        strategy={verticalListSortingStrategy}
      >
        <table className={style.table}>
          <thead>
            <tr>
              <th rowSpan="2">SUB CODE</th>
              <th rowSpan="2">SUB DESCRIPTION</th>
              <th colSpan="2">HOURS</th>
              <th colSpan="2">TOTAL UNIT</th>
              <th rowSpan="2">PREREQUISITE</th>
              {isEditing && <th rowSpan="2">Actions</th>}
            </tr>
            <tr>
              <th>LEC</th>
              <th>LAB</th>
              <th>LEC</th>
              <th>LAB</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}
