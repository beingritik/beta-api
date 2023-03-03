const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      match: [
        /^[A-Za-z\s]*$/,
        "Please provide name without special chars and numbers.",
      ],
      maxlength: 30,
      minlength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email , in proper email format.",
      ],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password field shouldnt be empty."],
      minlength: 6,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
    },
    dept: {
      type: String,
      required: [true, "Department name is required"],
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum:["active","inactive"],
      default:"active",
      required:true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  // console.log(this);
  if (!this._update.password) return next();

  if (this._update.password  ) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(update.password, salt);
    update.password = hashedPassword;
  }
});


// //creating jwt in mongoose
userSchema.methods.createJWT = async () => {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

//Comparing passwords method in mongoose
userSchema.methods.comparePassword = async function(enteredPassword){
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};


// };

// class User {
//   constructor(name,email,password,username){
//   this.name = name;
//   this.email = email;
//   this.password = password;
//   this.username = username;
//   }
//   saveData(){
//     console.log("inserting");

//   }
// }

module.exports = mongoose.model("User", userSchema);

