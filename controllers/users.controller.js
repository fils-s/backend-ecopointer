const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const config = require("../config/db.config.js");
const { use } = require("../routes/users.routes");


exports.create = async (req, res) => {
  const { username, nome, email, IDcidade, password, morada, xp, tipoUser } =
    req.body;

  if (
    !username ||
    !nome ||
    !email ||
    !IDcidade ||
    !password ||
    !morada ||
    !tipoUser
  ) {
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
    password: bcrypt.hashSync(req.body.password, 10),
    morada,
    xp: 0,
    tipoUser,
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


  try {
    if (req.loggedUserRole !== "admin")
    return res.status(403).json({
    success: false, msg: "This request requires ADMIN role!"
    });
    // do not expose users' sensitive data
    let users =   await User.find()
    .select("nome username email tipoUser")
    .exec();
    res.status(200).json({ success: true, users: users });
    }
    catch (err) {
    res.status(500).json({
    success: false, msg: err.message || "Some error occurred while retrieving all users."
    });
    };
    
};

exports.findOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("username nome email tipoUser")
      .exec();
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
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      msg: `ID parameter must not be empty!`,
    });
  }
  if (req.params.id !=req.loggedUserId ) {
    return res.status(403).json({
      success: false,
      msg: `Only the user can update its own profile`,
    });
  }
  
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    }).exec();
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
      return res.status(400).json;
    }
  }
};

exports.delete = async (req, res) => {
  
  try {
    if (req.loggedUserRole !== "admin")
    return res.status(403).json({
    success: false, msg: "This request requires ADMIN role!"
    });
    // do not expose users' sensitive data
    let user =   await User.findByIdAndRemove(req.params.id)
    .exec();
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
    },
   
  


    exports.login = async (req, res) => {
      try {
        console.log(req.body);
        if (!req.body || !req.body.username || !req.body.password) {
          return res
            .status(400)
            .json({ success: false, msg: "Must provide username and password." });
        }
    
        let user = await User.findOne({ username: req.body.username });
    
        if (!user) {
          return res.status(404).json({ success: false, msg: "User not found." });
        }
    
        const check = bcrypt.compareSync(req.body.password, user.password);
        if (!check) {
          return res
            .status(401)
            .json({
              success: false,
              accessToken: null,
              msg: "Invalid credentials!",
            });
        }
    
        const token = jwt.sign(
          { id: user._id, tipoUser: user.tipoUser },
          config.SECRET,
          {
            expiresIn: "24h", // 24 hours
          }
        );
        return res.status(200).json({ success: true, accessToken: token });
      } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.map((e) => e.message) });
        } else {
          res
            .status(500)
            .json({ success: false, msg: err.message || "Some error occurred at login." });
        }
      }
    };
    

