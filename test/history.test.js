const chai     = require('chai');
const chaiHttp = require('chai-http');
const expect   = chai.expect;
const app      = require('../app');
chai.use(chaiHttp);

const name_test               = 'ok';
const code_test               = 'ok';
var   _id                     = '';
const dummy_user_id           = '5b35aac98f0acf187dd5a561';

describe('history resolvers', () => {
  it('allHistories', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query: `
          query{
            histories {
              _id
              code
              user
              user
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
        done();
      });
  });

  it('save history only with name data', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation{
            saveHistory(name: "${name_test}" ){
              _id,
              name,
              code,
              user
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err;
        };
        expect(res.body.data.saveHistory).to.be.null;
        done();
      });
  });

  it('save history', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation{
            saveHistory(name: "${name_test}", code: "${code_test}", user: "${dummy_user_id}"){
              _id,
              name,
              code,
              user
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err;
        };
        _id = res.body.data.saveHistory._id;
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        done();
      });
  });

  it('delete history', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation{
            deleteHistory(_id: "${_id}"){
              _id,
              name,
              code,
              user
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

  it('save history without name', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation{
            saveHistory(code: "${code_test}", user: "${dummy_user_id}"){
              _id,
              name,
              code,
              user
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err;
        };
        _id = res.body.data.saveHistory._id;
        expect(res.body.data.saveHistory.name).to.be.equal('Untitled');
        done();
      });
  });

  
  it('find one history graphql', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          query{
            history(_id: "${_id}") {
              _id
              name
              code
              user
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
      })
  });

  it('find one history REST API', (done) => {
    chai.request(app)
      .get(`/history/${_id}`)
      .end((err, res) => {
        if(err) {
          throw err;
        };
        expect(res.status).to.be.equal(200);
        expect(res.body.result).to.be.an('object');
        done();
      })
  });

  it('update a history', (done) => {
    chai.request(app)
      .put(`/history/update/${_id}`)
      .send({
        code: 'ok'
      })
      .end((err, res) => {
        if(err) {
          throw err;
        };
        expect(res.status).to.be.equal(200);
        expect(res.body.update).to.be.an('object');
        done();
      })
  });

  it('delete history', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation{
            deleteHistory(_id: "${_id}"){
              _id,
              name,
              code,
              user
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