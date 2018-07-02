const Documentation = require('../models/Documentation');

module.exports = {
  async dropDocumentationCollections(req, res) {
    try {
      let result = await Documentation.collection.drop();
      res.status(200).json({
        result
      });
    } catch (error) {
      res.status(500).json({
        message: 'Something wrong'
      });
    }
  }
}