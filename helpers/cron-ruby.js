const CronJob   = require('cron').CronJob;
const ScrappingRuby = require('../helpers/scrapping-ruby');
const axios     = require('axios');

const job = new CronJob({
  cronTime: '00 02 * * *',
  onTick: function() {
    console.log('start')
    ScrappingRuby();
  },
  start: false,
  timeZone: 'Asia/Jakarta'
});
job.start();