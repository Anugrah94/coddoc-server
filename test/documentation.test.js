const chai     = require('chai');
const chaiHttp = require('chai-http');
const expect   = chai.expect;
const app      = require('../app');
chai.use(chaiHttp);

var _id = '';

describe('documentation resolvers', () => {
  it('allDocumentation', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query: `
          query{
            documentations{
              doc
              syntax
            }
          }
        `
      })
      .end((err, res) => {
        if(err){
          throw err;
        };
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.documentations).to.be.an('array');
        done();
      });
  });

  it('get documentation with keyword', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          query{
            documentation(syntaxes: ["variable python", "function python"]){
              doc
              syntax
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err;
        };
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.documentation).to.be.an('array');
        done();
      });
  });

  it('save documentation data', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation{
            saveDocumentation(syntax:"ok", doc:["ok", "ok", "ok"]){
              _id
              syntax
              doc
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err.message;
        };
        console.log(res.body.data)
        _id = res.body.data.saveDocumentation._id
        expect(res.body.data).to.be.an('object');
        done();
      });
  });

  it('delete documentation', (done) => {
    console.log(_id)
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation{
            deleteDocumentation(_id: "${_id}"){
              _id,
              syntax,
              doc
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err;
        };
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        done();
      });
  });
});