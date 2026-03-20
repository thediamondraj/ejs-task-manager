import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.render("pages/dashboard", { tasks });
  } catch (error) {
    res.render("pages/dashboard", { tasks: [], error: "Could not load tasks" });
  }
};

export const createTask = async (req, res) => {
  try {
    if (!req.body.title || !req.body.title.trim()) {
      return res.redirect("/dashboard");
    }

    await Task.create({
      title: req.body.title.trim(),
      user: req.user.id,
    });

    res.redirect("/dashboard");
  } catch (error) {
    res.redirect("/dashboard");
  }
};

export const editTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.redirect("/dashboard");
    }

    task.title = req.body.title.trim();
    await task.save();

    res.redirect("/dashboard");
  } catch (error) {
    res.redirect("/dashboard");
  }
};

export const deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.redirect("/dashboard");
  } catch (error) {
    res.redirect("/dashboard");
  }
};