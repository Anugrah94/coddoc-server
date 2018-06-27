require('dotenv').config()
const fs                                  = require('fs');
const createError                         = require('http-errors');
const express                             = require('express');
const path                                = require('path');
const cookieParser                        = require('cookie-parser');
const logger                              = require('morgan');
const mongoose                            = require('mongoose');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema }            = require('graphql-tools');
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@ds121301.mlab.com:21301/coddoc`)

const indexRouter = require('./routes/index');

const typeDefs = fs.readFileSync('./graphql/user/user.gql', 'utf8');
const resolvers = require('./graphql/user/resolver');

const app = express();
const db  = mongoose.connection;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connect to Mongoose Database CoddoC');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/graphql', graphqlExpress({ schema }))
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;