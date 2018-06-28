const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
  code: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  doc: [{
    type: String
  }]
},
{
  timestamps: true
});

const History = mongoose.model('History', historySchema);

module.exports = History;
