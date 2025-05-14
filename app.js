const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect("mongodb+srv://user2:Akhil1234@cluster0.notq9z9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// Define a numeric value for priorities
const priorityValues = {
  "High": 3,
  "Medium": 2,
  "Low": 1
};

// Schema and Model
const taskSchema = new mongoose.Schema({
  name: String,
  priority: String, // Low, Medium, High
  priorityValue: { type: Number, required: true } // Store numerical priority for sorting
});
const Task = mongoose.model("task", taskSchema);

// Fetch tasks and sort by numerical priority
app.get("/", async (req, res) => {
    try {
      const tasks = await Task.find().sort({ priorityValue: -1 }); // Sort by priorityValue (High -> Medium -> Low)
      res.render("list", { ejes: tasks });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
});
  
// Route to create new task
app.post("/", async function (req, res) {
  const taskName = req.body.ele1.trim();
  const priority = req.body.priority; // Get priority value from the form

  // Check if a valid priority is selected
  if (!priority || !priorityValues[priority]) {
    return res.status(400).send("Invalid priority selected.");
  }

  const priorityValue = priorityValues[priority]; // Get numeric value for priority

  if (taskName) {
    const newTask = new Task({ 
      name: taskName, 
      priority: priority, 
      priorityValue: priorityValue 
    });
    try {
      await newTask.save();
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error saving task.");
    }
  } else {
    res.status(400).send("Task name is required.");
  }
});

// Route to delete task
app.post("/delete", async function (req, res) {
  const taskId = req.body.deleteId; // Get task ID from the hidden input

  try {
    await Task.findByIdAndDelete(taskId);
    res.redirect("/");
  } catch (err) {
    console.log("Error deleting task:", err);
    res.redirect("/");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
