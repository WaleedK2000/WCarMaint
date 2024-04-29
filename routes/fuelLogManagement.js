const express = require("express");
const router = express.Router();

const FuelLog = require("../models/FuelLog");

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

// route to add a car

module.exports = router;
