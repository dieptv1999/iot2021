const { decrypt } = require('../../security/RSA');
const { DeviceInfo, validateDeviceData } = require("../../models/DeviceInfo");
const { Farm, validateData } = require("../../models/Farm");
const axios = require('axios');

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
    } else {
        console.log("Device: ");
        console.log(device_info);
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
    // write to thing speak
    if (device_info.apiChannelKey) {
        console.log("---------> API key: ")
        console.log(device_info.apiChannelKey);
        let request = 'https://api.thingspeak.com/update?api_key=' + device_info.apiChannelKey +
        '&field1=' + dataDecrypted.temp + '&field2=' + dataDecrypted.humidity + '&field3=' + dataDecrypted.light +
        '&field4=' + dataDecrypted.ec + '&field5=' + dataDecrypted.ph + '&field6=' + dataDecrypted.waterTemp;
        console.log(request)
        axios.get(request)
            .then(response => {
                console.log(response.statusText);
            })
            .catch(error => {
                console.log("Error occured when pushing data to chart");
            });
    }
}

module.exports = {
    handleData
};