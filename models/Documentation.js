const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentationSchema = new Schema({
  syntax: {
    type: String,
    required: true
  },
  doc: [{
    type: String,
    require: true
  }]
});

const Documentation = mongoose.model('Documentation', documentationSchema);

module.exports = Documentation;