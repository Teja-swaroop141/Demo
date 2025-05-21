import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;
    try {
      await axios.post('http://127.0.0.1:8000/api/tasks/', { title: newTask });
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error("Failed to add task:", err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err.message);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
        ...task,
        completed: !task.completed,
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task:", err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h1 className="title">📝 My To-Do List</h1>
      <div className="input-section">
        <input
          className="task-input"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button className="add-btn" onClick={addTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <span onClick={() => toggleComplete(task)}>
              {task.title}
            </span>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
