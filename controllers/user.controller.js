const User = require('../models/User');

module.exports = {
  async getAllUser(req, res) {
    try {
      let result = await User.find();
      res.status(200).json({
        result
      })
    } catch (error) {
      res.status(500).json({
        message: 'Something wrong'
      })
    }
  }
}