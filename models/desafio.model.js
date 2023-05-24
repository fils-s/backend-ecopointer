

module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      xp: { type: Number, required: [true, "XP field is mandatory"] },
      descDesafio: {
        type: String,
        required: [true, "DescDesafio field is mandatory"],
      },
      recompensa: {
        type: String,
        required: [true, "Recompensa field is mandatory"],
      },
      objetivoDesafio: {
        type: Number,
        required: [true, "objetivoDesafio field is mandatory"],
      },
      estadoDesafio: {
        type: Number,
        required: [true, "estadoDesafio field is mandatory"],
      },
      user: {
        type: String,
        required: [true, "Username field is mandatory"],
      },
    },
    { timestamps: false }
  );
  const Desafio = mongoose.model("desafios", schema);
  return Desafio;
};
