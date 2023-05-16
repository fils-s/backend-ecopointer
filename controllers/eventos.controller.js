const db = require("../models");
const Evento = db.eventos;

exports.create = async (req, res) => {
  const evento = new Evento({
    nome: req.body.nome,
    descricao: req.body.descricao,
    email: req.body.email,
    IDcidade: req.body.IDcidade,
    data: req.body.data,
    imagem: req.body.imagem,
    gostos: req.body.gostos,
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
      .select("nome descricao email IDcidade data imagem gostos")
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
  if (!req.body || !req.body._id) {
    return res.status(400).json({
      success: false,
      msg: `Id must not be empty!`,
    });
  }

  try {
    const evento = await Evento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true }
    ).exec();
    if (!evento) {
      return res.status(404).json({
        success: false,
        msg: `Cannot update Evento with ID ${req.params.id}`,
      });
    }
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
      msg: `Error updating Evento: ${error.message}`
      });
    }
  };
  
  exports.delete = async (req, res) => {
    try {
      const evento = await Evento.findByIdAndRemove(req.params.id).exec();
      if (!evento) {
        return res.status(404).json({
          success: false,
          msg: `Cannot delete Evento with ID ${req.params.id}`,
        });
      }
  
      return res.json({
        success: true,
        msg: `Evento with ID ${req.params.id} deleted successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: `Error deleting Evento: ${error.message}`,
      });
    }
  };
  