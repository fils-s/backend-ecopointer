const { type } = require("os");

module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, "Username field is mandatory"],
      },
      nome: { type: String, required: [true, "Nome field is mandatory"] },
      email: { type: String, required: [true, "Email field is mandatory"] },
      IDcidade: { type: String, required: [true, "Cidade field is mandatory"] },
      password: {
        type: String,
        required: [true, "Password field is mandatory"],
      },
      morada: { type: String, required: [true, "Morada field is mandatory"] },
      xp: { type: Number },
      IDtipoUser: {
        type: String,
        required: [true, "Type of user  is mandatory"],
      },
    },
    { timestamps: false }
  );
  
  const User = mongoose.model("users", schema);
  return User;
  
  
};
