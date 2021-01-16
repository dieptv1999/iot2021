const express = require("express");
const router = express.Router();
const { Farm, validateData } = require("../models/Farm");
const { client } = require("../config/config");
const verifyToken = require("../middleware/auth");
const {User} = require("../models/User");
const {DeviceInfo} = require("../models/DeviceInfo");

router.get("/lastest", verifyToken, async (req, res) => {
  const _user = req.user;

  const limit = parseInt(req.query.limit);

  const user = await User.findOne(
      {
          email: _user.email,
      }
    );

  console.log(user._id)

  const deviceInfo = await DeviceInfo.findOne(
    {
      userId: user._id,
    }
  );

  const farms = await Farm.find(
    {
      deviceId: deviceInfo.deviceId
    }
  ).sort({createdAt: -1}).limit(limit);

  farms.reverse();

  res.json({ error: null, data: farms });
})

// for testing only
router.post("/data", async (req, res) => {
  // validate the data
  const { error } = validateData(req.body);
  if (error) {
    return res.status(400).json({ error: error });
  }

  const data = new Farm({
    temp: req.body.temp,
    humidity: req.body.humidity,
    light: req.body.light,
    ec: req.body.ec,
    ph: req.body.ph,
    waterTemp: req.body.waterTemp,
  });

  try {
    const savedData = await data.save();
    res.json({ error: null, data: savedData });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// default topic paramater is Farm
router.get("/:topic", async (req, res) => {
  const topic = req.params.topic;
  const data = await Farm.find();
  if (!data) {
    return res.status(404).json({
      message: "No data found",
    });
  }

  return res.json({
    topic: topic,
    data: data,
  });
});

// default topic paramater is Farm
router.get("/:topic/:type", async (req, res) => {
  const topic = req.params.topic;
  const type = req.params.type;
  const data = await Farm.find();
  if (!data) {
    return res.status(404).json({
      message: "No data found",
    });
  }

  const topicData = [];
  data.forEach((doc) => topicData.push(doc[type]));

  client.subscribe(topic);
  client.publish(topic, topicData.toString());
  // test
  client.on("message", (topicName, message) => {
    console.log(message.toString());
  });

  return res.json({
    topic: topic,
    dataType: type,
    topicData: topicData,
  });
});

module.exports = router;
