// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Get API route files
const api = require('./routes/api');
const config = require('./config');
const appRoutes = require('./routes/app');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');
const findUserRoutes = require('./routes/find');
const profileRoutes = require('./routes/profile');

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
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
    next();
});

// Set API routes
app.use('/message', messageRoutes);
app.use('/user', userRoutes);
app.use('/find', findUserRoutes);
app.use('/profile', profileRoutes);
app.use('/', appRoutes);
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

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
server.listen(port, () => console.log(`API running on localhost:${port}`));