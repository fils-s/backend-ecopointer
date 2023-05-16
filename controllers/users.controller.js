const db = require("../models");
const User = db.users;

exports.create = async (req, res) => {
  const { username, nome, email, IDcidade, password, morada, xp, IDtipoUser } = req.body;

  if (!username || !nome || !email || !IDcidade || !password || !morada || !xp || !IDtipoUser) {
    return res.status(400).json({
      success: false,
      msg: "All fields must be provided",
    });
  }

  const user = new User({
    username,
    nome,
    email,
    IDcidade,
    password,
    morada,
    xp,
    IDtipoUser,
  });

  try {
    let newUser = await user.save();
    return res.status(201).json({
      success: true,
      msg: "New user created.",
      URL: "/user/" + newUser._id,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        msg: "Validation error",
        errors: errors,
      });
    } else {
      return res.status(500).json({
        success: false,
        msg: `Error creating user: ${error.message}`,
      });
    }
  }
};

exports.findAll = async (req, res) => {
  const id = req.query.id;
  let condition = id ? { username: new RegExp(id, "i") } : {};

  try {
    let data = await User.find(condition).select("username nome").exec();

    return res.status(200).json({ success: true, users: data });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: `Cannot find any user with the ID ${req.params.id}`,
      });
    }
    return res.json({ success: true, user: user });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        msg: `ID parameter is not a valid ObjectId`,
      });
    }
    return res.status(500).json({
      success: false,
      msg: `Error finding user: ${error.message}`,
    });
  }
};

exports.update = async (req, res) => {
  if (!req.body || !req.body.username) {
    return res.status(400).json({
      success: false,
      msg: `Username must not be empty!`,
    });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true }
    ).exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: `Cannot update user with ID ${req.params.id}`,
      });
    }
    return res.json({
      success: true,
      msg: `User with ID ${req.params.id} updated successfully`,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json
     }};

     exports.delete = async (req, res) => {
        try {
          const user = await User.findByIdAndRemove(req.params.id).exec();
          if (!user) {
            return res.status(404).json({
              success: false,
              msg: `Cannot delete user with ID ${req.params.id}`,
            });
          }
      
          return res.json({
            success: true,
            msg: `User with ID ${req.params.id} deleted successfully`,
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            msg: `Error deleting user: ${error.message}`,
          });
        }
      };
    }      

