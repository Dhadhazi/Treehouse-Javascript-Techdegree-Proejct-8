const express = require('express');
const router = express.Router();
const { Book } = require('../models').models;
const Sequelize = require('sequelize');

/* Handler function to wrap each route. */
function asyncHandler(cb) {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (error) {
			res.status(500).send(error);
		}
	};
}

//Redirect home to /books
router.get('/', (req, res, next) => {
	res.redirect('/books');
});

//Booklist at /books
router.get(
	'/books',
	asyncHandler(async (req, res) => {
		const books = await Book.findAll({
			order: [
				[
					'createdAt',
					'DESC'
				]
			]
		});
		res.render('index', { books });
	})
);

//New book maikng form
router.get('/books/new', (req, res, next) => {
	res.render('new-book');
});

//Create new book
router.post(
	'/books/new',
	asyncHandler(async (req, res) => {
		let book;
		try {
			book = await Book.create(req.body);
			res.redirect('/books/');
		} catch (error) {
			if (error.name === 'SequelizeValidationError') {
				book = await Book.build(req.body);
				res.render('new-book', { book, errors: error.errors });
			}
			else {
				throw error;
			}
		}
	})
);

//Show book info if exists, if not book-not-found. Could pass it to the 404 handler, but this is nicer
router.get(
	'/books/:id',
	asyncHandler(async (req, res) => {
		book = await Book.findByPk(req.params.id);
		if (book) {
			res.render('update-book', { book });
		}
		else {
			res.render('book-not-found');
		}
	})
);

//Book update at post method from update-book
router.post(
	'/books/:id',
	asyncHandler(async (req, res) => {
		let book;
		try {
			book = await Book.findByPk(req.params.id);
			await book.update(req.body);
			res.redirect('/books/');
		} catch (error) {
			if (error.name === 'SequelizeValidationError') {
				book = await Book.build(req.body);
				book.id = req.params.id;
				res.render('update-book', { book, errors: error.errors });
			}
			else {
				res.sendStatus(404);
			}
		}
	})
);

//Delete a book
router.post(
	'/books/:id/delete',
	asyncHandler(async (req, res, next) => {
		const book = await Book.findByPk(req.params.id);
		if (book) {
			await book.destroy();
			res.redirect('/books');
		}
		else {
			res.sendStatus(404);
		}
	})
);

module.exports = router;
