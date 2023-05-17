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
      user: {
        type: String,
      },
      utilizacao:{
        type: Number
      }
    },
    { timestamps: false }
  );
  const Ecoponto = mongoose.model("ecoponto", schema);
  return Ecoponto;
};
