const mongoose = require("mongoose");

const converstationSchema = mongoose.Schema(
  {
    members: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", converstationSchema);
