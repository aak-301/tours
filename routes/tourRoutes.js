const fs = require('fs');
const express = require('express');

const router = express.Router();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  const id = +req.params.id;
  const newTour = tours.find((el) => el.id === id);

  if (id > tours.length) {
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour: newTour },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      return res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
const updateTour = (req, res) => {
  const id = +req.params.id;

  if (id > tours.length) {
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

const deleteTour = (req, res) => {
  const id = +req.params.id;

  if (id > tours.length) {
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid Id',
    });
  }

  res.status(204).json({
    status: 'Success',
    data: null,
  });
};

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
