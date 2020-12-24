const { client } = require("../config/config");
// const {handle} = require('../service/HandleMessage')

const { Farm, validateData } = require("../models/Farm");
const { handle } = require("../service/pubsub/HandleMessage");

// subcribe to topic farm in mqttbox using hivemq lib
client.subscribe("DATA_TOPIC");
const subcribe = client.on("message", async (topic, message) => {
  handle(message);
  // const data = new Farm(JSON.parse(message.toString()));

  // // validate the data
  // const { error } = validateData(JSON.parse(message.toString()));
  // if (error) {
  //   return res.status(400).json({ error: error });
  // }

  // try {
  //   const savedData = await data.save();
  // } catch (error) {
  //   console.error(error);
  // }
});

module.exports = { subcribe };
