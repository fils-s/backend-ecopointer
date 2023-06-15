const db = require("../models");
const Desafio = db.desafios;

exports.create = async (req, res) => {
  const { xp,descDesafio, recompensa, objetivoDesafio, estadoDesafio, user } = req.body;

  try {
    const desafio = new Desafio({
      xp,
      recompensa,
      objetivoDesafio,
      estadoDesafio,
      user: req.loggedUserId,
      descDesafio
    });

    const newDesafio = await desafio.save();

    res.status(201).json({
      success: true,
      msg: "New Desafio created.",
      URL: "/desafio/" + newDesafio._id,
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
      msg: `Error creating Desafio: ${error.message}`,
    });
  }
};

exports.findAll = async (req, res) => {
  const { id } = req.query;
  const condition = id ? { title: new RegExp(id, "i") } : {};

  try {
    const desafios = await Desafio.find(condition)
      .select("xp recompensa objetivoDesafio estadoDesafio username descDesafio")
      .exec();

    return res.status(200).json({ success: true, data: desafios });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const desafio = await Desafio.findById(req.params.id).exec();
    if (!desafio) {
      return res.status(404).json({
        success: false,
        msg: `Cannot find any Desafio with the ID ${req.params.id}`,
      });
    }
    return res.json({ success: true, data: desafio });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        msg: `ID parameter is not a valid ObjectId`,
      });
    }
    return res.status(500).json({
      success: false,
      msg: `Error finding Desafio: ${error.message}`,
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
    const desafio = await Desafio.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    }).exec();

    if (!desafio) {
      return res.status(404).json({
        success: false,
        msg: `Cannot update Desafio with ID ${req.params.id}`,
      });
    }

    return res.json({
      success: true,
      msg: `Desafio with ID ${req.params.id} updated successfully`,
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
      msg: `Error updating Desafio: ${error.message}`,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    if (req.loggedUserRole !== "admin")
    return res.status(403).json({
    success: false, msg: "This request requires ADMIN role!"
    });
    const desafio = await Desafio.findByIdAndRemove(req.params.id).exec();
    if (!desafio) {
      return res.status(404).json({
        success: false,
        msg: `Cannot delete Desafio with ID ${req.params.id}`,
      });
    }
    return res.json({
      success: true,
      msg: `Desafio with ID ${req.params.id} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: `Error deleting Desafio: ${error.message}`,
    });
  }
};
