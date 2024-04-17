const morgan = require("morgan");
const express = require("express");
const homeController = require("./controller/home.controller");
const app = express();
const path = require("path");
const request = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const requestOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

//http logger
app.use(morgan("combined"));
app.use("", homeController);
//template engine
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(3000, async () => {
  console.log(`Started server on port 3000`);
});
