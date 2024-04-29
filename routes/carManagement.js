const express = require("express");
const router = express.Router();

const Car = require("../models/Car");
const User = require("../models/User");

router.get("/", async (req, res) => {
  res.status(200).send();
});

// route to add a car

router.post("/addCar", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
  } else {
    ownerId = user._id;

    const car = await Car.create({
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      mileage: req.body.mileage,
      owner: user._id,
    });
  }

  res.status(200).json({ message: "Car added successfully", req: req.body });
});

// route to get all cars

router.get("/getCars", async (req, res) => {
  const cars = await Car.find();
  res.status(200).json(cars);
});

module.exports = router;
