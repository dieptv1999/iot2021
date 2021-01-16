const express = require("express");
const router = express.Router();
const { DeviceInfo, validateDeviceData } = require("../models/DeviceInfo");
const { route } = require("./users");

router.post("/insertDatabase", async(req, res) => {
    // validate data input to deviceInfo table
    const { error } = validateDeviceData(req.body);
    if (error) {
        return res.status(400).json({ error: error });
    }

    deviceInfo = new DeviceInfo({
        deviceId: req.body.deviceId,
        key: req.body.key,
        publicKey: req.body.publicKey,
        privateKey: req.body.privateKey,
        expiredDate: req.body.expiredDate,
        status: req.body.status,
        userID: req.body.userID,
        apiChannelKey: req.body.apiChannelKey
    })

    try {
        const savedDevice = await deviceInfo.save();
        res.json({ error: null, data: savedDevice });
    } catch (error) {
        res.status(400).json({ error });
    }
})

module.exports = router;