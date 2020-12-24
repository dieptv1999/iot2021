const { client } = require('../config/config');

/**
 * Pushlish message to HiveMQ
 * @param {string} topic 
 * @param {json} message 
 */
const sendMessage = (topic, message) => {
    client.publish(topic, message);
}

module.exports = {
    sendMessage
}