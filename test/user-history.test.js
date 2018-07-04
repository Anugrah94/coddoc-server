const chai     = require('chai');
const chaiHttp = require('chai-http');
const expect   = chai.expect;
const app      = require('../app');
chai.use(chaiHttp);

const full_name_test = 'anugrah';
const userName_test  = 'anugrah94';
const email_test     = 'anugrah@mail.com';
const password_test  = '@Qwerty1234';
var token            = '';

const name_test               = 'ok';
const code_test               = 'ok';
var   _id                     = '';

describe('user and history resolvers', () => {
  it('allUsers', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query: `
          query{
            users {
              _id
              full_name
              username
              avatar
              email
              password
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

  it('allUsers REST API', (done) => {
    chai.request(app)
      .get(`/user`)
      .end((err, res) => {
        if(err) {
          throw err;
        };
        expect(res.status).to.be.equal(200);
        expect(res.body.result).to.be.an('array');
        done();
      })
  });
  
  it('register user', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation{
            register(full_name: "${full_name_test}", username: "${userName_test}", email: "${email_test}", password: "${password_test}") {
              user {
                full_name
                username
                histories{
                  _id
                }
              }
              token
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
        expect(res.body.data.register.token).to.be.a('string');
        token = res.body.data.register.token;
        done();
      });
  });

  it('register user with same account', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation{
            register(full_name: "${full_name_test}", username: "${userName_test}", email: "${email_test}", password: "${password_test}") {
              user {
                full_name
                username
                histories{
                  _id
                }
              }
              token
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err.message;
        };
        expect(res.body.data.register).to.be.null;
        done();
      });
  });


  it('authentication user', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          query{
            user(token: "${token}"){
              full_name
              username
              email
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

  it('authentication user without token', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          query{
            user(token: " "){
              full_name
              username
              email
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err;
        };
        expect(res.body.data.user).to.be.null;
        done();
      })
  });

  it('login user', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation login {
            login(email: "${email_test}", password: "${password_test}") {
              user {
                username
                full_name
              }
              token
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err;
        };
        token = res.body.data.login.token;
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.login.token).to.be.a('string');
        done();
      })
  });

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
            saveHistory(name: "${name_test}", code: "${code_test}", token: "${token}"){
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
            saveHistory(code: "${code_test}", token: "${token}"){
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

  it('login user with wrong email', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation login {
            login(email: "lala@mail.com", password: "${password_test}") {
              user {
                username
                full_name
              }
              token
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err;
        };
        expect(res.body.data.login).to.be.null;
        done();
      })
  });

  it('login user with wrong password', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation login {
            login(email: "${email_test}", password: "@lalalala1234Q") {
              user {
                username
                full_name
              }
              token
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err;
        };
        expect(res.body.data.login).to.be.null;
        done();
      })
  });

  it('update user', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation{
            updateUser(token:"${token}" full_name: "asep", email:"asep@mail.com", username:"asep44"){
              full_name
              username
              email
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

  it('update user without token', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation{
            updateUser( full_name: "asep", email:"asep@mail.com", username:"asep44"){
              full_name
              username
              email
            }
          }
        `
      })
      .end((err, res) => {
        if(err) {
          throw err;
        };
        expect(res.body.data.updateUser).to.be.null;
        done();
      });
  });

  it('delete user', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation delete{
            deleteUser(email: "asep@mail.com"){
              _id
              full_name
              username
              email
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