module.exports = (mongoose) => {
    const schema = mongoose.Schema(
      {
        imagem: { type: String, required: [true, "imagem field is mandatory"] },
        data: {
          type: Date,
          required: [true, "data field is mandatory"],
        },
        user: {
          type: String,
          
        },
        
      },
      { timestamps: false }
    );
    const Post = mongoose.model("posts", schema);
    return Post;
  };
  