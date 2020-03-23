const createError = require('http-errors');
const express = require('express');
const path = require('path');

const routes = require('./routes/index');

const app = express();
app.use('/static', express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// render the error page
	res.status(err.status || 500);
	res.render('page-not-found');
	console.log('Error: ' + err.message);
});

app.listen(3000, () => {
	console.log('The application is running on localhost:3000');
});
