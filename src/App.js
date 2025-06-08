import React, { useEffect, useState } from 'react';
import './App.css'; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "todo" });
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem("tasks");
    if (cached) {
      setTasks(JSON.parse(cached));
    } else {
      fetch("/api/tasks")
        .then(res => res.json())
        .then(data => {
          setTasks(data);
          localStorage.setItem("tasks", JSON.stringify(data));
        });
    }
  }, []);

  const handleAddTask = () => {
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    }).then(() => {
      fetch("/api/tasks")
        .then(res => res.json())
        .then(data => {
          setTasks(data);
          localStorage.setItem("tasks", JSON.stringify(data));
          setNewTask({ title: "", description: "", status: "todo" });
        });
    });
  };

  const handleSearch = () => {
    fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    })
      .then(res => res.json())
      .then(data => setSearchResults(data));
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <div className="task-list">
        <h2>Tasks</h2>
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <span>{task.title} — <i>{task.status}</i></span>
          </div>
        ))}
      </div>

      <div className="search-section">
        <h2>Search Similar Tasks</h2>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <div className="task-list">
          {searchResults.map((task, i) => (
            <div key={i} className="task-item">
              <span>{task.title} — <i>{task.description}</i></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
