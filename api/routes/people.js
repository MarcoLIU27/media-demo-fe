var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();
const RankingIndex = mongoose.model('RankingIndex');
const Bio = mongoose.model('Bio');

// 在/people页面显示所有名字，并链接到对应的peopledetail页面
//返回所有people的parentName, parentPresent, encodedParentName, shortBio
router.get('/', async (req, res) => {
    try {
      const parentNames = await RankingIndex.distinct('parent_name');
      const parentNamePresentPairs = await Promise.all(
        parentNames.map(async (parentName) => {
          const parentPresent = await RankingIndex.findOne({ parent_name: parentName })
                                   .then((doc) => doc.parent_present);
          const encodedParentName = encodeURIComponent(parentName);
          const shortBio = await Bio.findOne({ parent_name: parentName })
          .then((doc) => doc.short_bio);
          return { parentName, parentPresent, encodedParentName, shortBio };
        })
      );
    res.json(parentNamePresentPairs);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
});
  
// 获取单个人员的详细信息
router.get('/:encodedParentName', async (req, res) => {
    try {
        const parentName = decodeURIComponent(req.params.encodedParentName);
        // console.log(req.params);
        // console.log(req.params.encodedParentName);
        // console.log(parentName);
      const parent = await Bio.findOne({ parent_name: parentName });
      if (!parent) {
        return res.status(404).send(`No parent found with name ${parentName}`);
      }
      const parent1 = await RankingIndex.findOne({ parent_name: parentName });
      if (!parent) {
        return res.status(404).send(`No parent found with name ${parentName}`);
      }
        res.json({
            parent_name: parent.parent_name,
            parent_present : parent1.parent_present,
            short_bio: parent.short_bio,
            wiki_long_bio: parent.wiki_long_bio,
            baidu_long_bio: parent.baidu_long_bio
        });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
});
  
// 获取单个人员的排名指数,选定block下所有year-ranking_index pairs
router.get('/:encodedParentName/rankingIndex/:block', async (req, res) => {
  try {
    const { encodedParentName, block } = req.params;
    const parentName = decodeURIComponent(encodedParentName);
    RankingIndex.findOne({ parent_name: parentName })
      .then((parent) => {
        if (!parent) {
          return res.status(404).send(`No parent found with name ${parentName}`);
        }
        
        const rankingIndexDataPromise = RankingIndex.find({ parent_name: parentName, block: block }); // Find year, ranking under the block
        
        return Promise.all([parent, rankingIndexDataPromise]);
      })
      .then(([parent, rankingIndexData]) => {
        const data = rankingIndexData.map((item) => ({
          year: item.year,
          ranking_index: item.ranking_index,
        }));
        res.json(data);
      })
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});
  
// // 用于搜索，根据parent_present(不唯一)获取对应所有的人员以及parent_name
// router.get('/searchName/:presentName', async (req, res) => {
//   try {
      

//     const parent1 = await RankingIndex.find({ parent_present: presentName });
//     const parent_name = parent1.parent_present
//     const parent = await Bio.find({ parent_present: presentName });
    
//       res.json({
//           parent_name: parent.parent_name,
//           parent_present : parent1.parent_present,
//           short_bio: parent.short_bio,
//       });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal server error');
//   }
// });


  module.exports = router;