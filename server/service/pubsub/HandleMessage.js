const { authen } = require("./authentication");
const { handleData } = require("./HandleData");
/**
 * Định dạng tin nhắn gửi lên
 * {
 *  'type':'',  // type: 1 (authentication), 2 (send data)
 *  'data':{}   // type=1 thì data không được mã hóa, type=2 thì dữ liệu đã được mã hóa, cần giải mã trước khi xử lý
 * }
 * @param {json} message 
 */
const handle = async function(message) {
    try {
        let messageJson = JSON.parse(message.toString());
        switch (messageJson.type) {
            case 1:
                if (messageJson.data.id) { // device Id
                    authen(messageJson.data.id);
                }
                break;
            case 2:
                await handleData(messageJson);
                break;
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    handle
}