const CronJob = require('cron').CronJob;
const scrapping = require('../helper/scrapping');

const job = new CronJob({
  cronTime: '05 * * * * *',
  onTick: function() {
    console.log('job 1 ticked');
  },
  start: false,
  timeZone: 'Asia/Jakarta'
});

console.log('job1 status', job.running);
job.start();