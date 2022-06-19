const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const { type } = require("os");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/countries", function (request, response) {
  const fs = require("fs");
  fs.readFile("./countries.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    const data = JSON.parse(jsonString);
    response.send(data.data);
  });
});

app.get("/cities/:country", function (request, response) {
  var counrty = request.params.country;
  const fs = require("fs");
  fs.readFile("./countries.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    const data = JSON.parse(jsonString);
    for (key in data.data) {
      if (data.data[key].country == counrty) {
        response.send(data.data[key]);
      }
    }
  });
});

app.post("/", function (request, response) {
  const cityName = request.body.city;
  console.log(cityName);
  const key = "b44b54bfe626819f869fc40f411b23fa";
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    key +
    "&units=" +
    units;

  https.get(url, function (resData) {
    console.log(resData.statusCode);

    resData.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temprature = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const city = weatherData.name;
      console.log(city + " " + temprature);

      response.write("<h1>" + city + "</h1>");
      response.write("<h2>" + temprature + "</h2>");
      response.write("<h3>" + weatherDescription + "</h3>");
      response.write(
        '<img src="http://openweathermap.org/img/wn/' +
          weatherData.weather[0].icon +
          '.png">'
      );
      response.send();
    });
  });
});

function run(port) {
  console.log("server is running at port: " + port);
}

app.listen(process.env.PORT, run(process.env.PORT));
// app.listen('5000', run('5000'));