const mongoose = require("mongoose");
const Joi = require("joi");
const farmSchema = mongoose.Schema({
  deviceId : {
    type: String,
  },
  temp: {
    type: Number,
  },
  humidity: {
    type: Number,
  },
  light: {
    type: Number,
  },
  ec: {
    type: Number,
  },
  ph: {
    type: Number,
  },
  waterTemp: {
    type: Number,
  },
  createdAt: {
    type: Date,
  },
});

// function to validate data
const validateData = (data) => {
  const schema = Joi.object({
    temp: Joi.number(),
    humidity: Joi.number(),
    light: Joi.number(),
    ec: Joi.number(),
    ph: Joi.number(),
    waterTemp: Joi.number(),
  });

  return schema.validate(data);
};

const Farm = mongoose.model("Farm", farmSchema);

module.exports = { Farm, validateData };
