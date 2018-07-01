const History = require('../models/History');

module.exports = {
  async getOneHistory(req, res) {
    const { id } = req.params;
    try {
      let result = await History.findById({ _id: id });
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