const CronJob = require('cron').CronJob;
const scrapping = require('../helper/scrapping');
const Documentation = require('../models/Documentation');
// const mongoose = require('mongoose');

var job = new CronJob('* * * * * *', function() {
  // Documentation.collection.remove();
  console.log('start');
  }, function () {
    console.log('done');
  },
  true,
  'Asia/Jakarta'
);