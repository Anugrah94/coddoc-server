const secretKey     = process.env.SECRETKEY_JWT;
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');
const User          = require('../../models/Users');

const userResolver = {
  Mutation: {
    register: async (_, { full_name, username, email, password }) => {
      try {
        const user = await User.create({
          full_name,
          username,
          avatar: 'ini foto',
          email,
          password,
          histories: []
        });

        const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, secretKey);

        return {
          token,
          user
        };
      } catch (error) {
        console.error(error);
      }
    },
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });

        if (user) {
          const hashed = bcrypt.compareSync(password, user.password);

          if (hashed) {
            const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, secretKey);

            return {
              token,
              user
            };
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

module.exports = userResolver;