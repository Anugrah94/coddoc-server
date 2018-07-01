const bcrypt   = require('bcryptjs');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  full_name: {
    type: String,
    required: [ true, 'please input your full name' ]
  },
  username: {
    type: String,
    unique: [ true, 'username is already used' ],
    required: [ true, 'please input your username' ]
  },
  avatar: String,
  email: {
    type: String,
    unique: [ true, 'email is already used' ],
    validate: {
      validator: (email) => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
      },
      message: 'email format is wrong'
    },
    required: [ true, 'please input your email' ]
  },
  password: {
    type: String,
    validate: {
      validator: (password) => {
        return new Promise((resolve, reject) => {
          if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(String(password))) {
            resolve();
          } else {
            let statusMessage = 'password at least 8 characters and contains at least one number, one uppercase and one lowercase';

            reject(statusMessage);
          }
        })
      }
    }
  },
  histories: [{
    type: Schema.Types.ObjectId,
    ref: 'History'
  }]
}, {
  timestamps: true
});

userSchema.pre('save', function (next) {
  bcrypt.genSalt(10, (errSalt, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (!err) {
        this.password = hash;
        next()
      } else {
        next(err)
      }
    });
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;