import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import router from './src/routes/index.js';
import { closeDBConnection, createCollection } from './src/server/mongo-server.js';

var app = express();

app.set('views', 'src/views');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start the server
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  createCollection(); // Connect to the MongoDB database & create collection when the server starts
});

// Handle server shutdown gracefully
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await closeDBConnection(); // Close the MongoDB connection before shutting down the server
  server.close(() => {
    console.log('Server has been shut down.');
    process.exit(0);
  });
});
