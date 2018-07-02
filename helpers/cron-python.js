const CronJob   = require('cron').CronJob;
const ScrappingPython = require('../helpers/scrapping-python');

const job = new CronJob({
  cronTime: '0 01 * * *',
  onTick: function() {
    console.log('start')
    ScrappingPython();
  },
  start: false,
  timeZone: 'Asia/Jakarta'
});
job.start();