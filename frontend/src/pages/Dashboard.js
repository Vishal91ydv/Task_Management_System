import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/tasks/${editId}`, { title, description, status });
      } else {
        await API.post("/tasks", { title, description, status });
      }
      setTitle("");
      setDescription("");
      setStatus("pending");
      setEditId(null);
      fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };


  return (
    <>
      <Header />
      <div className="container">
        <div className="card dashboard">
          <button className="btn-danger logout" onClick={onLogout}>
            Logout
          </button>
          <h2>Welcome Dear {user?.name} </h2>

          <h3>{editId ? "Edit Task" : "Add New Task"}</h3>
          <form onSubmit={handleSubmit} className="task-form">
            <input
              type="text"
              placeholder="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <button type="submit" className="btn-primary">
              {editId ? "Update Task" : "Add Task"}
            </button>
          </form>

          <h3>Your Tasks</h3>
          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task._id} className="task-item">
                  <div>
                    <strong>{task.title}</strong> - {task.description} (
                    {task.status})
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(task)}
                      className="btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
