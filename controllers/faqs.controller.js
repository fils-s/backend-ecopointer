const db = require("../models");
const Faq = db.faqs;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const config = require("../config/db.config.js");
const { use } = require("../routes/users.routes");



exports.create = async (req, res) => {
  
  
  const faq = new Faq({
    nome: req.body.nome,
    descricao: req.body.descricao,
    type: req.body.type,
  });

  try {
    const newFaq = await faq.save();
    return res.status(201).json({
      success: true,
      msg: "New ajuda created.",
      URL: "/faq/" + newFaq._id,
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
      msg: `Error creating ajuda: ${error.message}`,
    });
  }
};

exports.findAll = async (req, res) => {
  const id = req.query.id;
  const condition = id ? { _id: id } : {};

  try {
    const data = await Faq.find(condition)
      .select("nome descricao type ")
      .exec();

    return res.status(200).json({ success: true, Faq: data });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id).exec();
    if (!faq) {
      return res.status(404).json({
        success: false,
        msg: `Cannot find any ajuda with the ID ${req.params.id}`,
      });
    }
    return res.json({ success: true, faq: faq });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        msg: `ID parameter is not a valid ObjectId`,
      });
    }
    return res.status(500).json({
      success: false,
      msg: `Error finding Ajuda: ${error.message}`,
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
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true }
    ).exec();
    if (!faq) {
      return res.status(404).json({
        success: false,
        msg: `Cant update ajuda with ID ${req.params.id}`,
      });
    }
    return res.json({
      success: true,
      msg: `Ajuda with ID ${req.params.id} updated successfully`,
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
      msg: `Error updating Evento: ${error.message}`
      });
    }
  };
  
  exports.delete = async (req, res) => {
    try {
        if (req.loggedUserRole !== "admin")
        return res.status(403).json({
        success: false, msg: "This request requires ADMIN role!"
        });
      const faq = await Faq.findByIdAndRemove(req.params.id).exec();
      if (!faq) {
        return res.status(404).json({
          success: false,
          msg: `Cannot delete Ajuda with ID ${req.params.id}`,
        });
      }
  
      return res.json({
        success: true,
        msg: `Ajuda with ID ${req.params.id} deleted successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: `Error deleting Ajuda: ${error.message}`,
      });
    }
  };
  