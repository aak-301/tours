const Tour = require('../models/tourModel');

exports.validateBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Failed',
      message: 'Please Enter the name and price of tour',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    // results: tours.length,
    // data: { tours },
  });
};

exports.getTour = (req, res) => {
  const id = +req.params.id;
  // const newTour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: { tour: newTour },
  // });
};

exports.createTour = (req, res) => {
  return res.status(201).json({
    status: 'success',
    // data: {
    //   tour: newTour,
    // },
  });
};
exports.updateTour = (req, res) => {
  const id = +req.params.id;

  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
