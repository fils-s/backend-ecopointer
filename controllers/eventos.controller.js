const db = require("../models");
const Evento = db.eventos;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const config = require("../config/db.config.js");
const { use } = require("../routes/users.routes");
const { log } = require("console");

exports.create = async (req, res) => {
  console.log(req.loggedUserId);
  const evento = new Evento({
    nome: req.body.nome,
    descricao: req.body.descricao,
    cidade: req.body.cidade,
    data: req.body.data,
    imagem: req.body.imagem,
    gostos: 0,
    user: req.loggedUserId,
  });

  try {
    const newEvento = await evento.save();
    return res.status(201).json({
      success: true,
      msg: "New Evento created.",
      URL: "/evento/" + newEvento._id,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        msg: "Validation error",
        errors: errors,
      });
    }
    return res.status(500).json({
      success: false,
      msg: `Error creating Evento: ${error.message}`,
    });
  }
};

exports.findAll = async (req, res) => {
  const id = req.query.id;
  const condition = id ? { _id: id } : {};

  try {
    const data = await Evento.find(condition)
      .select("nome descricao  cidade data imagem gostos user")
      .exec();

    return res.status(200).json({ success: true, Evento: data });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id).exec();
    if (!evento) {
      return res.status(404).json({
        success: false,
        msg: `Cannot find any Evento with the ID ${req.params.id}`,
      });
    }
    return res.json({ success: true, evento: evento });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        msg: `ID parameter is not a valid ObjectId`,
      });
    }
    return res.status(500).json({
      success: false,
      msg: `Error finding Evento: ${error.message}`,
    });
  }
};

exports.update = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      msg: `Id must not be empty!`,
    });
  }

  try {
    const evento = await Evento.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    }).exec();
    if (!evento) {
      return res.status(404).json({
        success: false,
        msg: `Cannot update Evento with ID ${req.params.id}`,
      });
    }
    console.log(evento);
    return res.json({
      success: true,
      msg: `Evento with ID ${req.params.id} updated successfully`,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        msg: `ID parameter is not a valid ObjectId`,
      });
    }
    return res.status(500).json({
      success: false,
      msg: `Error updating Evento: ${error.message}`,
    });
  }
};

exports.delete = async (req, res) => {
  
  try {
    if (req.loggedUserRole !== "admin")
    return res.status(403).json({
    success: false, msg: "This request requires ADMIN role!"
    });
    // do not expose users' sensitive data
    let evento =   await Evento.findByIdAndRemove(req.params.id)
    .exec();
    if (!evento) {
      return res.status(404).json({
        success: false,
        msg: `Cannot delete evento with ID ${req.params.id}`,
      });
    }
    return res.json({
      success: true,
      msg: `Evento with ID ${req.params.id} deleted successfully`,
    });
    
   
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: `Error deleting evento: ${error.message}`,
    });
    
  }
    }