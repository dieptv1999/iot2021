const SECRET_TOKEN = "iotUser";
const PORT_CONFIG = {
  port: 1883,
  host: "broker.hivemq.com",
};
const REQUEST_TOPIC = "REQUEST_TOPIC";
const RESPONSE_TOPIC = "RESPONSE_TOPIC";
const mqtt = require("mqtt");
const client = mqtt.connect(PORT_CONFIG);
module.exports = {
  SECRET_TOKEN,
  PORT_CONFIG,
  client,
  REQUEST_TOPIC,
  RESPONSE_TOPIC,
};
