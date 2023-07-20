const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  job_title: String,
  location: String,
  company_about_url: String,
  job_url: String,
  salary: {
    type: {
      salary_range: Array,
      unit: String,
    },
  },
  createdAt: Date,
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
