const Job = require('../models/jobModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getJobs = catchAsync(async (req, res, next) => {
  if (!req.body.location || !req.body.title)
    throw new AppError('location and title are required', 400);
  const { title, location } = req.body;
  const features = new APIFeatures(
    Job.find({
      job_title: title,
      location: { $regex: `^.*${location}.*$`, $options: 'i' },
    })
  );
  const jobs = await features.query;
  const jobCount = await features.query.clone().countDocuments();
  res.status(200).json({
    status: 'success',
    results: jobCount,
    data: {
      jobs,
    },
  });
});

module.exports = {
  getJobs,
};
