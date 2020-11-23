var express = require('express');
var app = express();
var oracledb = require('oracledb');
var dbconfig = require('./dbconfig.js');
const cors = require('cors');

oracledb.outFormat = oracledb.OUT_FORMAT_ARRAY;

app.use(
	cors({
	    origin: 'http://localhost:3000',
	    credentials: true,
	  })
);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/users', (req, res) => {
	dbconfig(`SELECT student_id as "id",
		student_key as "key",
		name as "name", date_added as "date",
		gpa as "gpa", category_id as "category",
		enrollments as "enrollments"
		 FROM students`, [], function (err, results) {
		if (!err) {
			console.log('fecthed');
			res.send(results.rows);
		}
		else {
			console.log(err.error);
		}
	});
});

app.get('/teachers', (req, res) => {
	dbconfig(`SELECT teacher_id as "id", name as "name" FROM teachers`, [], function (err, results) {
		if (!err) {
			res.send(results.rows);
		}
	});
});

app.delete(`/users/:id`, (req, res) => {
	dbconfig(`DELETE FROM students
		WHERE student_id = ${req.url.split("/")[2]}`, [], (err, results) => {
			if (!err) {
				res.send(results);
			}
	});
});

app.listen(5000, function () {
	console.log(`listening`);
});