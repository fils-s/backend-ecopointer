module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      nome: {
        type: String,
        required: [true, "Nome field is mandatory"],
      },
      descricao: {
        type: String,
        required: [true, "Descricao field is mandatory"],
      },

      cidade: { type: String, required: [true, "Cidade field is mandatory"] },
      data: {
        type: Date,
        required: [true, "Data field is mandatory"],
      },
      imagem: {
        type: String,
        required: [true, "Imagem field is mandatory"],
        validate: {
          validator: function (value) {
            return /.*\.(png|jpg|jpeg|gif|bmp)$/.test(value);
          },
          message: "Invalid image URL format",
        },
      },
      gostos: { type: Number },
      user: { type: String },
    },
    { timestamps: false }
  );
  const Evento = mongoose.model("eventos", schema);
  return Evento;
};
