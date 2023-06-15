const db = require("../models");
const Post = db.posts;

const { use } = require("../routes/users.routes");
const Ecoponto = db.ecopontos;

exports.create = async (req, res) => {
  console.log(req.loggedUserId);
  const post = new Post({
    imagem: req.body.imagem,
    data: req.body.data,
    user: req.loggedUserId,
  });

  try {
    const newPost = await post.save();
    return res.status(201).json({
      success: true,
      msg: "New Post created.",
      URL: "/post/" + newPost._id,
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
      msg: `Error creating Post: ${error.message}`,
    });
  }
};

exports.findAll = async (req, res) => {
  const id = req.query.id;
  const condition = id ? { _id: id } : {};

  try {
    const data = await Post.find(condition)
      .select("imagem data user ecoponto")
      .exec();

    return res.status(200).json({ success: true, Post: data });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();
    if (!post) {
      return res.status(404).json({
        success: false,
        msg: `Cannot find any Post with the ID ${req.params.id}`,
      });
    }
    return res.json({ success: true, post: post });
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
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    }).exec();
    if (!post) {
      return res.status(404).json({
        success: false,
        msg: `Cannot update Post with ID ${req.params.id}`,
      });
    }
    return res.json({
      success: true,
      msg: `Post with ID ${req.params.id} updated successfully`,
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
      msg: `Error updating Post: ${error.message}`,
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
    
    let post =   await Post.findByIdAndRemove(req.params.id)
    
    if (!post) {
      return res.status(404).json({
        success: false,
        msg: `Cannot delete Post with ID ${req.params.id}`,
      });
      
    }
    
      const ecoponto = await Ecoponto.findByIdAndUpdate(
        post.ecoponto,
        { $inc: { utilizacao: -1 } },
        { new: true }
      ).exec();
    
    
    
    return res.json({
      success: true,
      msg: `Post with ID ${req.params.id} deleted successfully`,
    });
    
   
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: `Error deleting Post: ${error.message}`,
    });
    
  }
    }