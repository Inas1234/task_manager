import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Task.css";
const STAGES = ["Todo", "In Progress", "Done"];

const Task = ({ task, onDelete, onStageChange, onNameChange }) => {
  const [stage, setStage] = useState(task.stage);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(task.name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    axios
      .put(
        `http://localhost/api/tasks/${task.id}/name`,
        { name: newName },
        {
          headers: { "X-User-Id": localStorage.getItem("userId") },
        }
      )
      .then((response) => {
        onNameChange(task.id, response.data.name);
      });
  };

  const handleChangeStage = (newStage) => {
    axios
      .put(
        `http://localhost/api/tasks/${task.id}`,
        { stage: newStage },
        {
          headers: { "X-User-Id": localStorage.getItem("userId") },
        }
      )
      .then((response) => {
        setStage(response.data.stage);
        onStageChange(task.id, response.data.stage);
      });
  };

  return (
    <div className="task">
      {isEditing ? (
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      ) : (
        <h2>{task.name}</h2>
      )}
      {isEditing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
      <select
        className="task-dropdown"
        value={stage}
        onChange={(e) => handleChangeStage(e.target.value)}
      >
        {STAGES.map((s, index) => (
          <option key={index} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button onClick={() => onDelete(task)}>Delete</button>
    </div>
  );
};

export default Task;
