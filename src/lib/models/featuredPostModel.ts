import mongoose from 'mongoose';

const featuredPostSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      unique: true,
    },
    overrideSummary: {
      type: String,
      default: '',
      maxlength: 187,
    },
    overrideImage: {
      type: String,
      default: '',
    },
    // Optional: if you plan to show multiple featured posts
    priority: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const FeaturedPost = mongoose.models.FeaturedPost || mongoose.model('FeaturedPost', featuredPostSchema);

export default FeaturedPost;