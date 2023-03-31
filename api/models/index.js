const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IndexSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  year: {
    type: Number,
    required: true,
  },
  media: {
    type: String,
    required: true,
  },
  parent_name: {
    type: String,
    required: true,
  },
  mention_count: {
    type: Number,
  },
  quote_count: {
    type: Number,
  },
  index_res: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const Index = mongoose.model("Index", IndexSchema);

module.exports = Index;
