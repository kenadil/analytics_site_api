var express = require('express');
var app = express();
var oracledb = require('oracledb');
var dbconfig = require('./dbconfig.js');
const cors = require('cors');
var bodyParser = require('body-parser');

oracledb.outFormat = oracledb.OUT_FORMAT_ARRAY;

app.use(
	cors({
	    origin: 'http://localhost:3000',
	    credentials: true,
	  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/users', (req, res) => {
	dbconfig(`SELECT student_id as "id",
		student_key as "key",
		name as "name", date_added as "date",
		gpa as "gpa", category_id as "category",
		enrollments as "enrollments"
		 FROM students
		 ORDER BY 
		 student_id ASC`, [], function (err, results) {
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
	dbconfig(`SELECT teacher_id as "id", name as "name" FROM teachers ORDER BY teacher_id ASC`, [], function (err, results) {
		if (!err) {
			res.send(results.rows);
		}
	});
});

app.delete(`/users/:id`, (req, res) => {
	var objs = req.url.split("/")[2].replace(/_/g, ',');
	dbconfig(`DELETE FROM students
		WHERE student_id in (${objs})`, [], (err, results) => {
			if (!err) {
				res.send(results);
			}
	});
});

app.patch(`/users/:id`, (req, res) => {
	console.log(req.body);
	dbconfig(`UPDATE students
		SET	name='${req.body.name}',
			gpa=${req.body.gpa},
			enrollments=${req.body.enrollments},
			category_id=${req.body.category}
		WHERE student_id = ${req.body.id}`, [], (err, results) => {
			if (!err) {
				res.send(results);
			}
	});
});

app.post(`/users`, (req, res) => {
	dbconfig(`
	INSERT INTO students
	(student_id, student_key, name, date_added, gpa, enrollments, category_id)
	VALUES 
	(${req.body.id}, ${req.body.key}, 
	'${req.body.name}', '${req.body.date}', ${req.body.gpa}, ${req.body.enrollments},
	${req.body.category})`, [], (err, results) => {
		if (!err) 
			res.send(results);
	});
	/*console.log(JSON.stringify(req.body.name));
	res.end(req.body);*/
});

app.listen(5000, function () {
	console.log(`listening`);
});
