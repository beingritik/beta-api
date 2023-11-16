const mongoose = require("mongoose");


//defined schemas 

const playerStatisticsSchema =  new mongoose.Schema({
  score: Number,
  level: Number,
  achievements: String,
});
const gameResultSchema =  new mongoose.Schema({
  wins: Number,
  losses: Number,
});


//universal game schemas
const gameSchema = new mongoose.Schema(
  {
    user_id: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
      type:Number,
      required: true,
      unique:true
    },
    gameName: [String],
    playerStatistics: [playerStatisticsSchema],
    gameResults: [gameResultSchema],
  },
  { timestamps: true }
);

// studentSchema.pre("save", async function (next) {
//   this.status =
//     this.status.charAt(0).toUpperCase() + this.status.slice(1).toLowerCase();
//   this.address =
//     this.address.charAt(0).toUpperCase() + this.address.slice(1).toLowerCase();
//   next();
// });

// studentSchema.pre("findOneAndUpdate", async function (next) {
//   // console.log(this._update.status);
//   if (!this._update.status) return next();
//   if (this._update.status) {
//     this._update.status =
//       this._update.status.charAt(0).toUpperCase() +
//       this._update.status.slice(1).toLowerCase();
//   }

//   if (this._update.address) {
//     this._update.address =
//       this._update.address.charAt(0).toUpperCase() +
//       this._update.address.slice(1).toLowerCase();
//   }
// });

module.exports = mongoose.model("game", gameSchema);
