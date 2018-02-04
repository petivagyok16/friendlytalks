// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Get API route files
const config = require('./config');
const appRoutes = require('./routes/app');
const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const findUserRoutes = require('./routes/find');
const profileRoutes = require('./routes/profile');

// Middleware
const authenticate = require('./middleware/authenticate');

const app = express();
mongoose.Promise = global.Promise;

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist')));

//Connecting to MongoDB
mongoose.connect(config.getDbConnectionString());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Credentials", 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Credentials, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
  next();
});

// Set API routes
app.use('/auth', authRoutes);
app.use('/message', messageRoutes);
app.use('/find', findUserRoutes);
app.use('/profile', profileRoutes);
app.use('/', appRoutes);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

console.log(`valami uj koooood`);

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API is running on localhost:${port}`));