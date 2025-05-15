const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect("mongodb+srv://user2:Akhil1234@cluster0.notq9z9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const taskSchema = new mongoose.Schema({
  name: String,
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    required: true
  }
});
const Task = mongoose.model("task", taskSchema);

app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().lean();
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    res.render("list", { ejes: tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/", async (req, res) => {
  const taskName = req.body.ele1.trim();
  const priority = req.body.priority;

  if (!["High", "Medium", "Low"].includes(priority)) {
    return res.status(400).send("Invalid priority selected.");
  }

  if (taskName) {
    await Task.create({ name: taskName, priority });
  }
  res.redirect("/");
});

app.put("/update/:id", async (req, res) => {
  const taskId = req.params.id;
  const newName = req.body.updatedText.trim();

  try {
    if (newName) {
      await Task.findByIdAndUpdate(taskId, { name: newName });
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error updating:", err);
    res.redirect("/");
  }
});

app.delete("/delete/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    await Task.findByIdAndDelete(taskId);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting:", err);
    res.redirect("/");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
