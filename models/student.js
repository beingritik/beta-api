const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    aadharnumber: {
      type: Number,
      required: [true, "Please provide aadhar number"],
      match: [
        /^[(]?[0-9]{3}[)]?[0-9]{3}?[0-9]{4,6}$/,
        "Please provide valid aadhar number",
      ],
      unique: true,
      minlength: 12,
      maxlength: 12,
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "Please provide D.O.B"],
      trim: true,
    },
    bloodgroup: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    address: {
      type: String,
      maxlength: 120,
      trim: true,
    },
    status: {
      type: String,
      // enum: ["Enrolled", "Passout", "Verified"],
      // default: "Enrolled",
      required: [true, "please provide status value."],
      trim: true,
    },
    rollno: {
      type: Number,
      required: [true, "Roll Number is required"],
      trim: true,
    },
    admdate: {
      type: Date,
      required: [true, "Please provide admission Date"],
      trim: true,
    },
    phone: {
      type: Number,
      match: [
        /^[(]?[0-9]{3}[)]?[0-9]{3}?[0-9]{4,6}$/,
        "Please provide valid phone number of 10 digits without any special chars.",
      ],
      minlength: 10,
      maxlength: 10,
      trim: true,
      required: true,
    },
    // dept: {
    //   type: String,
    //   required: [true, "Department name is required"],
    //   uppercase: true,
    //   trim: true,
    // },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function (next) {
  this.status =
    this.status.charAt(0).toUpperCase() + this.status.slice(1).toLowerCase();
  this.address =
    this.address.charAt(0).toUpperCase() + this.address.slice(1).toLowerCase();
  next();
});

studentSchema.pre("findOneAndUpdate", async function (next) {
  // console.log(this._update.status);
  if (!this._update.status) return next();
  if (this._update.status) {
    this._update.status =
      this._update.status.charAt(0).toUpperCase() +
      this._update.status.slice(1).toLowerCase();
  }

  if (this._update.address) {
    this._update.address =
      this._update.address.charAt(0).toUpperCase() +
      this._update.address.slice(1).toLowerCase();
  }
});

module.exports = mongoose.model("Student", studentSchema);
