const History = require('../../models/History');

const historyResolver = {
  Query: {
    histories: async () => {
      try {
        const result = await History.find();
        return result;
      } catch (error) {
        console.error(error);
      }
    },
    history: async (_, { _id }) => {
      console.log(_id)
      try {
        const result = await History.findById(_id);
        return result;
      } catch (error) {
        console.error(error);
      }
    }
  },
  Mutation: {
    saveHistory: async (_, { code, result, doc }) => {
      console.log(doc)
      // let docData = doc.split(',');
      try {
        const history = await History.create({
          code,
          result,
          doc
        });
        return history;
      } catch (error) {
        console.error(error);
      }
    }
  }
};

module.exports = historyResolver;