const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const subcribe = require("./pubsub/subcribe");
const bodyParser = require("body-parser");
const config = require("./config/dev");
const {DeviceInfo} = require("./models/DeviceInfo");
const { decrypt } = require('./security/RSA');

const mongoose = require("mongoose");
const connect = mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/users", require("./routes/users"));
app.use("/api/deviceinfo", require("./routes/deviceInfo"));
app.use("/api", require("./routes/farm"));
app.use("/api/device", require("./routes/control"));

const port = process.env.PORT || 5000;

// socket to send data to mobile
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const { client } = require("../server/config/config");
// array to keep track of clients connect to server
const socketData = [];
const { SECRET_TOKEN } = require("./config/config");
const jwt = require("jsonwebtoken");

io.on("connection", (socket) => {
  console.log("New connection: " + socket.id);
  console.log(socket.id);
  socketData.push(socket.id);

  // send real time data from hivemq
  socket.on("topic", (topicReceived) => {
    console.log(
      "Client " +
        socket.id +
        " wantes to connect to " +
        topicReceived.message +
        " topic"
    );

    // verify user
    const token = topicReceived.token;
    try {
      const verified = jwt.verify(token, SECRET_TOKEN);

      

      // get lastest json object data from hivemq
      client.subscribe(topicReceived.message);
      const subcriber = client.on("message", async (topic, message) => {
        const data = JSON.parse(message.toString());
        const deviceInfo = await DeviceInfo.findOne(
          {
            userId: verified.id,
          }
        )
        if(data.type === 2 && data.deviceId === deviceInfo.deviceId){
          const dataDecrypted = JSON.parse(decrypt(data.data, parsePrivateKey(deviceInfo.privateKey)));
          // only send to client require the topic
          socket.emit(`${topicReceived.message}data`, dataDecrypted);
        }else if(data.type === 3 && data.deviceId === deviceInfo.deviceId){
          const dataDecrypted = decrypt(data.state, parsePrivateKey(deviceInfo.privateKey));
          socket.emit(`${topicReceived.message}state`, dataDecrypted.toString());
        }
      });
    } catch (err) {
      // invalid token
      console.log(err);
    }
  });
});

function parsePrivateKey(key) {
  let formattedKey = "";
  for (var i = 0; i < key.length; i++) {
      if (i == 31 || ((i - 31) % 65 == 0 && i < 1648) || i == 1648)
          formattedKey += "\r\n";
      else formattedKey += key[i];
  }
  return formattedKey;
}

server.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
