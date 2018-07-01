const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
  name: {
    type: String,
    default: 'Untitled'
  },
  language_programme: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  code: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

historySchema.pre('save', function (next) {
  this
    .model('User')
    .update({
      _id: this.user
    }, {
      $push: {
        histories: this._id
      }
    }, {
      multi: true
    },
    next
  )
})

const History = mongoose.model('History', historySchema);

module.exports = History;
