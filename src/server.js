const express = require("express");
const envFile = process.env.NODE_ENV != 'test' ? '.env' : '.env.test'
require("dotenv").config({path: envFile});
const bodyParser = require("body-parser");
const authRouter = require("./modules/auth/routes");
const moviesRouter = require("./modules/movies/routes");
const db = require("./db/db");

const PORT = 3000;

const app = express();

app.use(bodyParser.json());

app.use("/", authRouter);
app.use("/", moviesRouter);

app.use((error, _, res, __) => {
  console.error(
    `Error processing request ${error}. See next message for details`
  );
  console.error(error);

  return res.status(500).json({ error: "internal server error" });
});

if (process.env.NODE_ENV != 'test') {
  db.connect();
  app.listen(PORT, () => {
    console.log(`auth svc running at port ${PORT}`);
  });
}

module.exports = app;