module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      localizacao: {
        latitude: {
          type: Number,
          required: [true, "Latitude field is mandatory"],
        },
        longitude: {
          type: Number,
          required: [true, "Longitude field is mandatory"],
        },
      },
      descricao: {
        type: String,
        required: [true, "Descrição field is mandatory"],
      },
      user: {
        type: String,
      },
      utilizacao: {
        type: Number,
      },
    },
    { timestamps: false }
  );

  const Ecoponto = mongoose.model("ecoponto", schema);
  return Ecoponto;
};
