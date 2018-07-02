const CronJob   = require('cron').CronJob;
const axios     = require('axios');

dropDocumentationCollection = async () => {
  try {
    let result = await axios.get('http://localhost:3000/documentation/drop-documentation');
    return result.data.result;
  } catch (error) {
    return error
  }
};

const job = new CronJob({
  cronTime: '0 00 * * *',
  onTick: function() {
    console.log('start')
    console.log(dropDocumentationCollection());
  },
  start: false,
  timeZone: 'Asia/Jakarta'
});
job.start();