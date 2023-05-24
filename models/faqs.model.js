
module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      nome: {
        type: String,
        required: [true, "Nome field is mandatory"],
      },
      descricao: {
        type: String,
        required: [true, "Descrição field is mandatory"],
      },
      type: {
        type: String,
        required: [true, "Username field is mandatory"],
      },
    },
    { timestamps: false }
  );
  const Faq = mongoose.model("faq", schema);
  return Faq;
};
