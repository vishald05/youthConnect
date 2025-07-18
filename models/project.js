const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: String,
  startDate: String,
  endDate: String,
  createdBy: { type: String, required: true }, // Username or ID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('project', projectSchema);
