const mongoose = require("mongoose");

const { Schema } = mongoose;

const fuelLogSchema = new Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  cost_per_liter: {
    type: Number,
    required: true,
  },
  liters: {
    type: Number,
    required: true,
  },
  millage: {
    type: Number,
    required: true,
  },
});

const FuelLogModel = mongoose.model("FuelLog", fuelLogSchema);

module.exports = FuelLogModel;
