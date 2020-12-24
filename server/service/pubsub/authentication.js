const { sendMessage } = require("../../pubsub/publisher");
const { RESPONSE_TOPIC } = require("../../config/config");
const { DeviceInfo, validateData } = require("../../models/DeviceInfo");
const { genKeys } = require("../../security/RSA");

var url = "mongodb://localhost:27017/";
/**
 *
 * @param {*} key
 */
function parsePublicKey(key) {
  var formattedKey = "";
  for (var i = 0; i < key.length; i++) {
    if (i == 26 || ((i - 26) % 65 == 0 && i < 430) || i == 426)
      formattedKey += "\r\n";
    else formattedKey += key[i];
  }
  return formattedKey;
}

const authen = async function (key) {
  /**
   * TABLE(COLLECTION) DEVICE_INFO
   * |deviceId|key|publicKey|privateKey|expireDate|status|
   */

  /**
   * B1: Kiểm tra xem id có tồn tại trong database hay không? Nếu không tồn tại thì không cần xư lý tiếp
   * B2: Kiểm tra xem trong database có cặp khóa chưa hết hạn không ?
   *      - Nếu có thì trả về publicKey luôn
   *      - Nếu không có thì thực hiện sinh cặp khóa, lưu vào database với ngày hết hạn được có thể được
   *        config và trả về publicKey vừa sinh ra
   */
  //TODO code in here
  const data = await DeviceInfo.findOne({ deviceId: key });
  if (!data) {
    console.log("No deviceId found");
    return;
  }
  let expiredDate = data.expiredDate;
  if (expiredDate < Date.now()) {
    key = genKeys();
    publicKey = key.publicKey;
    privateKey = key.privateKey;
    expiredDate = Date(Date.now() + 3600);
    DeviceInfo.findOneAndUpdate(
      {
        key: key,
      },
      {
        $set: {
          publicKey: publicKey,
          privateKey: privateKey,
          expiredDate: expiredDate,
        },
      },
      {
        returnNewDocument: true,
      },
      function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      }
    );
  } else {
    publicKey = data.publicKey;
  }

  //TODO response message: message bao gồm deviceId và publicKey
  //sendMessage(RESPONSE_TOPIC, responseMessage);
  var responseMessage = {
    type: "1",
    data: {
      id: data.deviceId,
      pubkey: parsePublicKey(data.publicKey),
    },
  };
  console.log(responseMessage);
  sendMessage("AUTH_TOPIC/"+data.deviceId, JSON.stringify(responseMessage));
  return responseMessage;
};

module.exports = {
  authen,
};
