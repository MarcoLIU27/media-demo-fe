const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');

// Load envioronment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// Variable to be sent to Frontend with Database status
let databaseConnection = "Waiting for Database response...";

router.get("/", function(req, res, next) {
    res.send(databaseConnection);
});

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost', {
        useNewUrlParser: true,
        dbName: 'MediaProject',
    })

// If there is a connection error send an error message
const db = mongoose.connection.on("error", error => {
    console.log("Database connection error:", error);
    databaseConnection = "Error connecting to Database";
});

// If connected to MongoDB send a success message
mongoose.connection.once("open", () => {
    console.log("Connected to Database!");
    console.log('Mongo connection started on ' + db.host + ':' + db.port)
    //console.log('Connected to database:', db);
    databaseConnection = "Connected to Database";
});

module.exports = router;

const Index = require('../models/index.js');
const RankingIndex = require('../models/rankingIndex.js');
const Bio = require('../models/bio.js');

const migrateRankingIndexToBio = async () => {
    try {
        const parentNames = await RankingIndex.distinct('parent_name');
        for (let i = 0; i < parentNames.length; i++) {
            const parentName = parentNames[i];
            const records = await RankingIndex.find({ parent_name: parentName });

            // Check if bio record already exists for this parent_name and bio_source
            const bioRecord = await Bio.findOne({
                parent_name: parentName,
                short_bio_source: records[0].short_bio_source,
            });
            if (!bioRecord) {
                const record = records[0];
                const newBioRecord = new Bio({
                    parent_name: record.parent_name,
                    short_bio_source: record.short_bio_source,
                    wiki_link: record.wiki_link,
                    baidu_link: record.baidu_link,
                    short_bio: '',
                    wiki_long_bio: '',
                    baidu_long_bio: '',
                });
                await newBioRecord.save();
            }
        }
        console.log('Saved migrateRankingIndexToBio data to collection!');
    } catch (error) {
      console.error(error);
    }
}
  
const updateBio = async () => {
    try {
        console.log('Start updating bio!');
        const bios = await Bio.find();

        for (let i = 0; i < bios.length; i++) {
            const bio = bios[i];
            // 1. 首先跟据short_bio_source更新short_bio
            if (bio.short_bio_source === 'wiki_link') {
              // 爬取wiki_link对应的网页，提取short_bio并保存到数据库
              const response = await axios.get(bio.wiki_link);
              const $ = cheerio.load(response.data);
                const short_bio = $(".shortdescription").text().trim();
                //console.log(bio, short_bio);
              await Bio.findByIdAndUpdate(bio._id, { short_bio });
            } else if (bio.short_bio_source === 'baidu_link') {
              // 爬取baidu_link对应的网页，提取short_bio并保存到数据库
              const response = await axios.get(bio.baidu_link);
              const $ = cheerio.load(response.data);
                const short_bio = $(".lemma-desc").text().trim();
                //console.log(bio, short_bio);
              await Bio.findByIdAndUpdate(bio._id, { short_bio });
            } else {
              // 直接保存short_bio到数据库
              await Bio.findByIdAndUpdate(bio._id, { short_bio: bio.short_bio_source });
            }

            // 2. 如果wiki_link不为"/", 抓取wiki_bio
            if (bio.wiki_link !== '/') {
                // 爬取wiki_link对应的网页，提取short_bio并保存到数据库
                const response = await axios.get(bio.wiki_link);
                const $ = cheerio.load(response.data);
                const wiki_long_bio = $('.mw-parser-output p:not(.mw-empty-elt)').eq(0)
                                        .clone().find("sup").remove().end().text().trim();
                  //console.log(bio, wiki_long_bio);
                await Bio.findByIdAndUpdate(bio._id, { wiki_long_bio });
            }
            // 3. 如果baidu_link不为"/", 抓取baidu_bio
            if (bio.baidu_link !== '/') {
                // 爬取wiki_link对应的网页，提取short_bio并保存到数据库
                const response = await axios.get(bio.baidu_link);
                const $ = cheerio.load(response.data);
                const baidu_long_bio = $(".lemma-summary")
                    .clone().find("sup").remove().end().text().trim()
                    .replace(/\n/g, "").replace(/\[[0-9]+\]/g, "");
                  //console.log(bio, baidu_long_bio);
                await Bio.findByIdAndUpdate(bio._id, { baidu_long_bio });
            }
        }          
    } catch (error) {
        console.error(error);
    }
}

// 如果RankingIndex中人物不存在Bio中，添加到Bio
//migrateRankingIndexToBio();

// 每天0点执行一次 loadBio 函数
cron.schedule('0 0 * * *', function () {
    const now = new Date();
    console.log(`Current time is: ${now}`);
    updateBio();
});


// // 每1分钟执行一次 loadBio 函数，可更改时间
// cron.schedule('*/1 * * * *', function () {
//     const now = new Date();
//     console.log(`Current time is: ${now}`);
//     updateBio();
// });






////// Testing ////
// // Create a new document
// const rankingIndex = new RankingIndex({
//     id: 1,
//     year: 2022,
//     block: "CNN",
//     parent_name: "John Doe",
//     parent_present:"John Doe",
//     ranking_index: 20,
//   });
  
// // Save the document to the collection
// rankingIndex.save(function (err) {
// if (err) console.error(err);
// console.log('Saved index to collection.');
// });