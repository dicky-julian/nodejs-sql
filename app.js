require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const helper = require('./src/helper');
const connection = require('./src/helper/mysql');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

connection.connect(function(err) {
    if (err) throw err;
    console.log('Database has connected');
});

// GET Data
app.get('/products', function(req, res) {
    connection.query("SELECT * FROM products", function(err, result) {
        if (err) return helper.response(res, err.sqlMessage, 400, 'false');

        return helper.response(res, result, 200, 'success');
    })
});

// POST Data
app.post('/products', function(req, res) {
    const data = req.body;
    console.log(req.body);

    connection.query("INSERT INTO products SET ?", data, function(err, result) {
        if (err) return helper.response(res, err.sqlMessage, 400, 'false');
        
        const newData = {
            id: result.insertId,
            ...data
        };

        return helper.response(res, newData, 200, 'success')
    });
});

// PUT Data
app.put('/products/:id', function(req, res) {
    const data = req.body;
    const id = req.params.id;

    connection.query('UPDATE products SET ? WHERE id=?', [data, id], function(err, result) {
        if (err) return helper.response(res, err.sqlMessage, 400, 'false');

        const newData = {
            id: result.insertId,
            ...data
        };

        return helper.response(res, newData, 200, 'success')
    });
});

// DELETE Data
app.delete('/products/:id', function(req, res) {
    const id = req.params.id;

    connection.query('DELETE FROM products WHERE id=?', id, function(err, result) {
        if (err) return helper.response(res, err.sqlMessage, 400, 'false');

        return helper.response(res, `Berhasil Hapus Data ID ${id}`, 200, 'success')
    })
})

app.listen(process.env.PORT_APP, function() {
    console.log(`posapp-api runnig port ${process.env.PORT_APP}`);
});