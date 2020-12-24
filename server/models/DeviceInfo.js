const mongoose = require("mongoose");
const Joi = require("joi");

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
    });

    return schema.validate(data);
};

const DeviceInfo = mongoose.model("DEVICE_INFO", deviceInfoSchema);

module.exports = { DeviceInfo, validateDeviceData };