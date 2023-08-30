const { query } = require('express');
const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    /*
     THIS IS HOW WE CAN CHAIN A BUNCH OF QUERRIES
     const tours = await Tour.find(queryObj);
     const tours = await Tour.find()
       .where('duartion')
       .equals(5)
       .where('diffculty')
       .equals('easy');
    */

    // BUILD QUERY
    // 1a) FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1b) ADVANCD FILTERING
    /*
     QREQ.QUERY WHEN WE WANT DURATION>=5
     {difficulty:'easy', duration:{gte:5}}
     {difficulty:'easy', duration:{$gte:5}} // ->MONGO QUERY(The only differene is $)
    */

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING
    /*
      a> for ascending simply add that field
      and for descending add - in front of that field
      E.g.:sort=-price

      b> Inorder to sort on the basis of two fields in mongoose
      We do: sort('price ratingsAverage');
      And the query is like: sort=prie,ratingsAverage
    */
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }else{
      query=query.sort("-createdAt");
    }

    // QUERY EXECUTION
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'No tour found!',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data set',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data set',
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data set',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.i);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data set',
    });
  }
};
