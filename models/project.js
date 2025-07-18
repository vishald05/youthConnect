const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  startDate: String,
  duration: String,
  minParticipants: Number,
  createdBy: String
});

module.exports = mongoose.model('Project', projectSchema);
