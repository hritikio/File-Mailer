const { Schema, model } = require("mongoose");

const logSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    minLength: 10,
    required: true,
    lowercase: true,
  },
  filename: {
    type: String,
    required: true,
  },
  filesize: {
    type: Number,
    required: true,
  },
  status: String, //Succesfull or Unsuccesful
  createdAt: {
    //Time at which file sended
    type: Date,
    default: Date.now,
  },
});

const log = model("Log", logSchema);
module.exports = log; //exported a model log
