const { decrypt } = require('../../security/RSA');
const { DeviceInfo, validateDeviceData } = require("../../models/DeviceInfo");
const { Farm, validateData } = require("../../models/Farm");

function parsePrivateKey(key) {
    let formattedKey = "";
    for (var i = 0; i < key.length; i++) {
        if (i == 31 || ((i - 31) % 65 == 0 && i < 1648) || i == 1648)
            formattedKey += "\r\n";
        else formattedKey += key[i];
    }
    return formattedKey;
}

const handleData = async function(dataEncrypted) {

    /**
     * B1: Lấy privateKey theo deviceId trong database
     * B2: Giải mã dữ liệu 
     * B3: Insert vào database 
     */
    let deviceId = dataEncrypted.deviceId;
    let device_info = await DeviceInfo.findOne({ deviceId: deviceId });
    if (!device_info) {
        console.log("No device found with id: " + deviceId);
        return;
    }
    let dataDecrypted = JSON.parse(decrypt(dataEncrypted.data, parsePrivateKey(device_info.privateKey)));
    let farm = new Farm({
        deviceId: dataDecrypted.deviceId,
        temp: dataDecrypted.temp,
        humidity: dataDecrypted.humidity,
        light: dataDecrypted.light,
        ec: dataDecrypted.ec,
        ph: dataDecrypted.ph,
        waterTemp: dataDecrypted.waterTemp,
        createdAt: dataDecrypted.createAt
    });

    console.log(farm)
    try {
        let savedData = await farm.save();
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    handleData
};