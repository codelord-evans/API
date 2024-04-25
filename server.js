const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Since we are not in sql we need to write a simple id generation logic here 
function generateUserId() {
  return Math.floor(Math.random() * 10000); // Simple random number generation, you might want to replace this with a more robust method
}

// Endpoint to get all users
app.get("/api/users", (req, res) => {
  try {
    const usersData = JSON.parse(fs.readFileSync("./users.json"));
    res.status(200).json(usersData);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Endpoint to add a new user
app.post("/api/users", (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = { id: generateUserId(), name, email };

    // Read existing users data
    const usersData = JSON.parse(fs.readFileSync("./users.json"));

    // Add new user
    usersData.push(newUser);

    // Write updated data back to the file
    fs.writeFileSync("./users.json", JSON.stringify(usersData, null, 2));

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to update a user
app.put("/api/users/:id", (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const {id, name, email } = req.body;

    // Read existing users data
    const usersData = JSON.parse(fs.readFileSync("./users.json"));

    // Find the user by ID and update its name and email
    const updatedUsers = usersData.map((user) => {
      if (user.id === userId) {
        return { id,user, name, email };
      }
      return user;
    });

    // Writing updated data back to the file
    fs.writeFileSync("./users.json", JSON.stringify(updatedUsers, null, 2));

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to delete a user
app.delete("/api/users/:id", (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Reading existing users data
    const usersData = JSON.parse(fs.readFileSync("./users.json"));

    // Filtering out the user to be deleted
    const updatedUsers = usersData.filter((user) => user.id !== userId);

    // Write updated data back to the file
    fs.writeFileSync("./users.json", JSON.stringify(updatedUsers, null, 2));

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
