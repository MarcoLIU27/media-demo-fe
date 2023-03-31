const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rankingIndexSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  year: { type: Number, required: true },
  block: { type: String, required: true },
  parent_name: { type: String, required: true },
  parent_present: { type: String, required: true },
  ranking_index: { type: Number, required: true },
  country_county: { type: String },
  nationality: { type: String },
  classification: { type: String },
  field: { type: String },
  gender: { type: String },
  birth: { type: String },
  chinese_translation: { type: String },
  English_fullname: { type: String },
  short_bio_reference: { type: String },
  short_bio_source: { type: String },
  wiki_link: { type: String },
  baidu_link: { type: String },
});

const RankingIndex = mongoose.model("RankingIndex", rankingIndexSchema);

module.exports = RankingIndex;
