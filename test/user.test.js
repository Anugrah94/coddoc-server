const chai     = require('chai');
const chaiHttp = require('chai-http');
const expect   = chai.expect;
const app      = require('../app');
chai.use(chaiHttp);

const full_name_test = 'anugrah';
const userName_test  = 'anugrah94';
const email_test     = 'anugrah@mail.com';
const password_test  = '@Qwerty1234';
var token          = '';


describe('user resolvers', () => {
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
          throw err;
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
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.login.token).to.be.a('string');
        done();
      })
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

  it('delete user', (done) => {
    chai.request(app)
      .post('/graphql')
      .send({
        query:`
          mutation delete{
            deleteUser(email: "${email_test}"){
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