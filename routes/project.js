const express = require('express');
const router = express.Router();
const Project = require('../models/project');

router.post('/createproj', async (req, res) => {
  const { title, description, location, startDate, duration, minParticipants, createdBy } = req.body;

  try {
    const newProject = new Project({
      title,
      description,
      location,
      startDate,
      duration,
      minParticipants,
      createdBy
    });

    await newProject.save();

    res.redirect('/home.html');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating project");
  }
});


router.get("/all", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});


module.exports = router;