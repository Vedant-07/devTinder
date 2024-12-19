const mongoose = require("mongoose");
const User=require("./User")
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:User
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId, //use mongoose.Schema.Types.ObjectId
      required: true,
      ref:User
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignore", "accepted", "rejected"],
        message: "values entered in status other than valid ones -- `{VALUE}`",
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  //so i cant write try catch here in the middleware
  if (this.fromUserId.equals(this.toUserId))
    return next(new Error("request to the same user is sent"))
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
