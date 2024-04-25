import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users.json");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users", {name, email });
      console.log("User added:", response.data);
      setName("");
      setEmail("");
      
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const handleUpdate = async (id) => {
    const updatedName = prompt("Enter updated name:");
    const updatedEmail = prompt("Enter updated email:");
    try {
      await axios.put(`/api/users/${id}`, { name: updatedName, email: updatedEmail });
      alert("User updated successfully!");
     
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/user/${id}`);
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };
  return (
    <div className="App">
      <h1>Adding Users</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Add User</button>
      </form>
      <div>
        <h2> Users </h2>
        <ul>
          {users.map((user, id) => (
            <li key={id}>
              <strong>Name:</strong> {user.name}, <strong>Email:</strong>{" "} {user.email}
              <button onClick={() => handleUpdate(user.id)}>Update</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default App;
