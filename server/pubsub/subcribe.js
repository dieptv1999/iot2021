const { client } = require("../config/config");
// const {handle} = require('../service/HandleMessage')

const { Farm, validateData } = require("../models/Farm");
const { handle } = require("../service/pubsub/HandleMessage");

// subcribe to topic farm in mqttbox using hivemq lib
client.subscribe("DATA_TOPIC");
const subcribe = client.on("message", async (topic, message) => {
  handle(message);
});

module.exports = { subcribe };
