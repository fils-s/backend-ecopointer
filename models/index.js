const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
const db = {};

db.mongoose = mongoose;
db.url = dbConfig.URL;

db.mongoose
  .connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database!");

    db.users = require("./user.model.js")(mongoose);
    db.ecopontos = require("./ecoponto.model.js")(mongoose);
    db.desafios = require("./desafio.model.js")(mongoose);
    db.eventos = require("./evento.model.js")(mongoose);

    const User = db.users;

    User.findOne()
      .then((users) => {
        console.log("Users:", users);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

module.exports = db;
