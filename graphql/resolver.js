const secretKey = process.env.SECRETKEY_JWT;
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const User      = require('../models/Users');
const History   = require('../models/History');

const mapResolver = {
  Query: {
    histories: async () => {
      try {
        let result = await History.find();
        return result;
      } catch (error) {
        return error;
      }
    },
    history: async (_, { _id }) => {
      try {
        let result = await History.findById(_id);
        return result;
      } catch (error) {
        return error;
      }
    },
    user: async (_, { token }) => {
      let decoded = jwt.verify(token, secretKey);
      try {
        let result = await User.findById(decoded.id);
        return result;
      } catch (error) {
        return error;
      }
    },
    users: async () => {
      try {
        let result = await User.find();
        return result;
      } catch (error) {
        return error;
      }
    }
  },
  Mutation: {
    register: async (_, { full_name, username, email, password }) => {
      try {
        let user = await User.create({
          full_name,
          username,
          avatar: 'ini foto',
          email,
          password,
          histories: []
        });
        let token = jwt.sign({ id: user._id, username: user.username, email: user.email }, secretKey);
        return {
          token,
          user
        };
      } catch (error) {
        return error
      }
    },
    login: async (_, { email, password }) => {
      try {
        let user = await User.findOne({ email });
        if (user) {
          let hashed = bcrypt.compareSync(password, user.password);
          if (hashed) {
            let token = jwt.sign({ id: user._id, username: user.username, email: user.email }, secretKey);
            return {
              token,
              user
            };
          }
        }
      } catch (error) {
        return error;
      }
    },
    deleteUser: async (_, { email }) => {
      try {
        let result = await User.findOneAndRemove({ email })
        return result;
      } catch (error) {
        return error;
      }
    },
    saveHistory: async (_, { name, code, result, doc }) => {
      try {
        let history = await History.create({
          name,
          code,
          result,
          doc
        });
        return history;
      } catch (error) {
        return error;
      }
    },
    deleteHistory: async (_, { _id }) => {
      try {
        let result = await History.findByIdAndRemove(_id)
        return result;
      } catch (error) {
        return error;
      }
    },
  }
};

module.exports = mapResolver;