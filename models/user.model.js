const { type } = require("os");

module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, "Username field is mandatory"],
      },
      nome: { type: String, required: [true, "Nome field is mandatory"] },
      email: {
        type: String,
        required: [true, "Email field is mandatory"],
        validate: {
          validator: function (value) {
            
            return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
          },
          message: "Email format is invalid",
        },
      },
      IDcidade: { type: String, required: [true, "Cidade field is mandatory"] },
      password: {
        type: String,
        required: [true, "Password field is mandatory"],
      },
      morada: { type: String, required: [true, "Morada field is mandatory"] },
      xp: { type: Number },
      tipoUser: {
        type: String,
        required: [true, "Type of user is mandatory"],
        enum: {
          values: ["admin", "user"],
          message: "The user type can only be 'admin' or 'user'",
        },
      },
    },
    { timestamps: false }
  );

  const User = mongoose.model("users", schema);
  return User;
};
