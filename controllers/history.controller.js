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
  },
  async updateHistory(req, res) {
    const { id } = req.params;
    const { code } = req.body;
    try {
      let update = await History.findByIdAndUpdate({_id: id}, {$set: {code}}, {new: true});
      res.status(200).json({
        message: 'History updated',
        update
      })
    } catch (error) {
      res.status(500).json({
        message: 'Something wrong'
      })
    }
  }
}