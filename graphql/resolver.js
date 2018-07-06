const secretKey     = process.env.SECRETKEY_JWT;
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');
const User          = require('../models/User');
const History       = require('../models/History');
const Documentation = require('../models/Documentation');

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
        let result = await User.findById({_id: decoded.id}).populate('histories');
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
    },
    documentations: async () => {
      try {
        let result = await Documentation.find();
        return result;
      } catch (error) {
        return error;
      }
    },
    documentation: async (_, { syntaxes }) => {
      let doc = [];
      try {
        for(let i=0; i< syntaxes.length; i++) {
          let result = await Documentation.findOne({ syntax: syntaxes[i] });
          doc.push(result);
        };
        return doc;
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
      } catch (errors) {
        return errors;
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
    updateUser: async (_, { token, full_name, username, email }) => {
      const decoded = jwt.verify(token, secretKey);
      if(decoded) {
        try {
          let update = await User.findOneAndUpdate({ _id: decoded.id },{ $set: {
            full_name,
            username,
            email
          }}, { new: true });
          return update;
        } catch (error) {
          return error;
        }
      } else {
        return 'You not have authorize and authentication to do this action !!'
      }
    },
    deleteUser: async (_, { email }) => {
      try {
        let result = await User.findOneAndRemove({ email });
        return result;
      } catch (error) {
        return error;
      }
    },
    saveHistory: async (_, { token, name, code }) => {
      const decode = jwt.verify(token, secretKey);
      try {
        let history = await History.create({
          user: decode.id,
          name,
          code
        });
        return history;
      } catch (error) {
        return error;
      }
    },
    deleteHistory: async (_, { _id }) => {
      try {
        let result = await History.findByIdAndRemove(_id);
        return result;
      } catch (error) {
        return error;
      }
    },
    saveDocumentation: async (_, { syntax, doc }) => {
      try {
        let documentation = await Documentation.create({
          syntax,
          doc
        });
        return documentation;
      } catch (error) {
        return error;
      }
    },
    deleteDocumentation: async (_, { _id }) => {
      try {
        let result = await Documentation.findByIdAndRemove(_id);
        return result;
      } catch (error) {
        return error;
      }
    },
  },
};

module.exports = mapResolver;