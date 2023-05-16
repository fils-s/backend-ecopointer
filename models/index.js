const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
const db = {};

db.mongoose = mongoose;
db.url = dbConfig.URL;

db.mongoose
  .connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to the database!");

    

  
  })
  
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
  db.users = require("./user.model.js")(mongoose);
    db.ecopontos = require("./ecoponto.model.js")(mongoose);
    db.desafios = require("./desafio.model.js")(mongoose);
    db.eventos = require("./evento.model.js")(mongoose);

module.exports = db;
