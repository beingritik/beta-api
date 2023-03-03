const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedback: {
      type: String,
      maxlength: 150,
      trim: true,
      required:true
  },
  },
  { timestamps: true }
);

feedbackSchema.pre("save", async function (next) {
  this.feedback =
    this.feedback.charAt(0).toUpperCase() + this.feedback.slice(1).toLowerCase();
  next();
});


module.exports = mongoose.model("Feedback", feedbackSchema);
