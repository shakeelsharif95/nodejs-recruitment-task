const mongoose = require("mongoose");

exports.connect = function () {
  mongoose.connect(process.env.DB_CONNECTION_STRING).then(
    () => {
      /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */

      console.log("Connected to MongoDB!");
    },
    (err) => {
      /** handle initial connection error */ console.log(
        "Connection to MongoDB failed !",
        err
      );
    }
  );
};
