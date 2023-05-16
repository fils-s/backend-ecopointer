const { type } = require("os");
module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      localizacao: {
        type: Array,
        required: [true, "Localização field is mandatory"],
      },
      descricao: {
        type: String,
        required: [true, "Descrição field is mandatory"],
      },
      username: {
        type: String,
        required: [true, "Username field is mandatory"],
      },
    },
    { timestamps: false }
  );
  const Ecoponto = mongoose.model("ecoponto", schema);
  return Ecoponto;
};
