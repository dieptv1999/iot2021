const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { sendMessage } = require("../pubsub/publisher");

const verifyToken = require("../middleware/auth");
const { verifySignature } = require("../security/signature")
const { DeviceInfo } = require("../models/DeviceInfo");

const fs = require('fs');

router.post("/control", verifyToken, async (req, res) => {


  //B1: Nhận command 
  let data = req.body.data;
  let signature = req.body.signature;

  const _user = req.user;



  const user = await User.findOne(
    {
      email: _user.email,
    }
  );

  const deviceInfo = await DeviceInfo.findOne(
    {
      userId: user._id,
    }
  );

  const publicKey = user.publicKey;
  // //B2: Xác thực chữ ký 

  if (await verifySignature(data, signature, publicKey)) {

    console.log("OK")

    //B3: Gửi dữ liệu vào HiveMQ
    console.log(JSON.stringify(data),"device");
    sendMessage("CONTROL/" + deviceInfo.deviceId, JSON.stringify(data));
  }

  res.json({
    error: null,
    message: "OK",
    data: null,
  })

});


module.exports = router;