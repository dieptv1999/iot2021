const mongoose = require("mongoose");
const Joi = require("joi");
const { Int32 } = require("mongodb");
const { boolean } = require("joi");

/**
 * TABLE(COLLECTION) DEVICE_INFO 
 * |deviceId|key|publicKey|privateKey|expireDate|status|
 */
const deviceInfoSchema = mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: false,
    },
    key: {
        type: String,
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    expiredDate: {
        type: Date,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    apiChannelKey: {
        type: String
    }
})

// function to validate device_info
const validateDeviceData = (data) => {
    const schema = Joi.object({
        deviceId: Joi.string(),
        key: Joi.string(),
        publicKey: Joi.string(),
        privateKey: Joi.string(),
        expiredDate: Joi.date(),
        status: Joi.boolean(),
        userID: Joi.string(),
        apiChannelKey: Joi.string()
    });

    return schema.validate(data);
};

const DeviceInfo = mongoose.model("DEVICE_INFO", deviceInfoSchema);

module.exports = { DeviceInfo, validateDeviceData };