const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bioSchema = new Schema({
  parent_name: { type: String, required: true },
  short_bio_source: { type: String, required: true },
  wiki_link: { type: String },
  baidu_link: { type: String },
  short_bio: { type: String },
  wiki_long_bio: { type: String },
  baidu_long_bio: { type: String },
}, {versionKey: false});

const Bio = mongoose.model("Bio", bioSchema);

module.exports = Bio;



  
  
  
  
  
  
  
