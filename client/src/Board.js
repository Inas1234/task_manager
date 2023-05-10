// TaskBoard.js
import React, { useEffect, useState } from "react";
import Task from "./components/Task";
import "./Board.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const STAGES = ["Todo", "In Progress", "Done"];

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const fetchTasks = async () => {
    axios
      .get("http://localhost/api/tasks", {
        headers: { "X-User-Id": localStorage.getItem("userId") },
      })
      .then((response) => {
        setTasks(response.data);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async () => {
    const response = await axios.post(
      "http://localhost/api/tasks",
      {
        name: newTaskName,
        userId: 1,
      },
      {
        headers: { "X-User-Id": localStorage.getItem("userId") },
      }
    );
    setTasks([...tasks, response.data]);
    setNewTaskName("");
  };

  const handleDelete = async (task) => {
    await axios.delete(`http://localhost/api/tasks/${task.id}`, {
      headers: { "X-User-Id": localStorage.getItem("userId") },
    });
    setTasks(tasks.filter((t) => t.id !== task.id));
  };

  const handleStageChange = (taskId, newStage) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, stage: newStage } : task
      )
    );
  };

  const handleNameChange = (taskId, newName) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, name: newName } : task
      )
    );
  };

  return (
    <div className="task-board">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <div className="input-section">
        <input
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="New task name"
        />
        <button onClick={handleCreate}>Create Task</button>
      </div>
      <div className="stages">
        {STAGES.map((stage, index) => (
          <div key={index} className="stage">
            <h2>{stage}</h2>
            {tasks
              .filter((task) => task.stage === STAGES[index])
              .map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                  onStageChange={handleStageChange}
                  onNameChange={handleNameChange}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
