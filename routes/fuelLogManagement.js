const express = require("express");
const router = express.Router();

const FuelLog = require("../models/FuelLog");
const Car = require("../models/Car");

router.get("/", async (req, res) => {
  res.status(200).send();
});

router.post("/addFuelLog", async (req, res) => {
  const fuelLog = await FuelLog.create({
    timestamp: req.body.timestamp,
    date: req.body.date,
    car: req.body.car,
    cost: req.body.cost,
    cost_per_liter: req.body.cost_per_liter,
    liters: req.body.liters,
    millage: req.body.millage,
  });

  res
    .status(200)
    .json({ message: "Fuel log added successfully", req: req.body });
});

router.get("/getFuelLogs", async (req, res) => {
  const fuelLogs = await FuelLog.find();
  res.status(200).json(fuelLogs);
});

router.get("/getFuelLogs/owner/:ownerId", async (req, res) => {
  const fuelLogs = await FuelLog.find({ owner: req.params.ownerId });
  res.status(200).json(fuelLogs);
});

router.get("/getFuelLogs/car/:carId", async (req, res) => {
  const fuelLogs = await FuelLog.find({ car: req.params.carId });
  res.status(200).json(fuelLogs);
});

router.get("/getFuelLogs/dashboard/:ownerId", async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.params.ownerId });

    const fuelLogs = await FuelLog.aggregate([
      {
        $match: {
          car: {
            $in: cars.map((car) => {
              console.log(car, 22);
              return car._id;
            }),
          },
        },
      },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "carDetails",
        },
      },
      {
        $unwind: "$carDetails",
      },
      {
        $project: {
          _id: 1,
          timestamp: 1,
          date: 1,
          car: {
            $concat: [
              "$carDetails.make",
              " ",
              "$carDetails.model",
              " ",
              { $toString: "$carDetails.year" },
            ],
          },
          make: 1,
          cost: 1,
          cost_per_liter: 1,
          liters: 1,
          millage: 1,
        },
      },
    ]);

    res.status(200).json(fuelLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// route to add a car

module.exports = router;
