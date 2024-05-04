const express = require("express");
const router = express.Router();

const Car = require("../models/Car");
const User = require("../models/User");

router.get("/", async (req, res) => {
  res.status(200).send();
});

// route to add a car

router.post("/addCar", async (req, res) => {
  const { owner } = req.body;

  const user = await User.findOne({ owner });

  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
  } else {
    let ownerId = user._id;

    const car = await Car.create({
      registrationNumber: req.body.registrationNumber,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      mileage: req.body.mileage,
      owner: user._id,
    });
    res.status(200).json({ message: "Car added successfully", req: req.body });
  }
});

// route to modify a car
router.put("/modifyCar/:carId", async (req, res) => {
  const { carId } = req.params;
  const { registrationNumber, make, model, year, color, mileage } = req.body;

  try {
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    car.registrationNumber = registrationNumber || car.registrationNumber;
    car.make = make || car.make;
    car.model = model || car.model;
    car.year = year || car.year;
    car.color = color || car.color;
    car.mileage = mileage || car.mileage;

    await car.save();

    res.status(200).json({ message: "Car modified successfully", car });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// route to get all cars

router.get("/getCars", async (req, res) => {
  const cars = await Car.find();
  res.status(200).json(cars);
});

// route to get cars by owner
router.get("/getCars/owner/:ownerId", async (req, res) => {
  const cars = await Car.find({ owner: req.params.ownerId });
  res.status(200).json(cars);
});

module.exports = router;
