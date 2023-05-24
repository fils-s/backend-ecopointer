module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
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
      data: {
        type: Date,
        required: [true, "Data field is mandatory"],
      },
      user: {
        type: String,
      },
      ecoponto :{
        type: String,
      }
    },
    { timestamps: false }
  );

  const Post = mongoose.model("posts", schema);
  return Post;
};
