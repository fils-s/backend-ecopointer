const db = require("../models");
const Ecoponto = db.ecopontos;
const Post = db.posts;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const config = require("../config/db.config.js");

exports.create = async (req, res) => {
  try {
    const ecoponto = new Ecoponto({
      localizacao: req.body.localizacao,

      descricao: req.body.descricao,
      user: req.loggedUserId,
      utilizacao: 0,
    });
    console.log(req.loggedUserId);
    const newEcoponto = await ecoponto.save();

    res.status(201).json({
      success: true,
      msg: "New Ecoponto created.",
      URL: "/ecoponto/" + newEcoponto._id,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ success: false, errors });
    }
    return res.status(500).json({
      success: false,
      msg: `Error creating Ecoponto: ${error.message}`,
    });
  }
};

exports.findAll = async (req, res) => {
  const { id } = req.query;
  const condition = id ? { title: new RegExp(id, "i") } : {};

  try {
    const data = await Ecoponto.find(condition)
      .select("localizacao descricao user utilizacao")
      .exec();

    return res.status(200).json({ success: true, ecoponto: data });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const ecoponto = await Ecoponto.findById(req.params.id).exec();
    if (!ecoponto) {
      return res.status(404).json({
        success: false,
        msg: `Cannot find any Ecoponto with the ID ${req.params.id}`,
      });
    }
    return res.json({ success: true, ecoponto });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        msg: `ID parameter is not a valid ObjectId`,
      });
    }
    return res.status(500).json({
      success: false,
      msg: `Error finding Ecoponto: ${error.message}`,
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
    const ecoponto = await Ecoponto.findByIdAndUpdate(
      req.params.id,
      req.body
    ).exec();

    if (!ecoponto) {
      return res.status(404).json({
        success: false,
        msg: `Cannot update Ecoponto with ID ${req.params.id}`,
      });
    }

    return res.json({
      success: true,
      msg: `Ecoponto with ID ${req.params.id} updated successfully`,
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
      msg: `Error updating Ecoponto: ${error.message}`,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    if (req.loggedUserRole !== "admin")
      return res.status(403).json({
        success: false,
        msg: "This request requires ADMIN role!",
      });
    const ecoponto = await Ecoponto.findByIdAndRemove(req.params.id).exec();
    if (!ecoponto) {
      return res.status(404).json({
        success: false,
        msg: `Cannot delete Ecoponto with ID ${req.params.id}`,
      });
    }
    return res.json({
      success: true,
      msg: `Ecoponto with ID ${req.params.id} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: `Error deleting Ecoponto: ${error.message}`,
    });
  }
};

exports.add = async (req, res) => {
  console.log(req.loggedUserId)
  if (!req.params || !req.params.id) {
    return res.status(400).json({
      success: false,
      msg: `Id must not be empty!`,
    });
  }
  try {
    const ecoponto = await Ecoponto.findByIdAndUpdate(
      req.params.id,
      { $inc: { utilizacao: 1 } },
      { new: true }
    ).exec();
    
    

    if (!ecoponto) {
      return res.status(404).json({
        success: false,
        msg: `Cannot update Ecoponto with ID ${req.params.id}`,
      });
    
    }
    
    let post = new Post({
      imagem: req.body.imagem,
      data: req.body.data,
      user: req.loggedUserId,
      ecoponto: req.params.id
    });
    
      await post.save();

    return res.json({
      success: true,
      msg: `Ecoponto with ID ${req.params.id} updated successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: `Error uploading post of this Ecoponto: ${error.message}`,
    });
  }
};
