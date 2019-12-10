var express = require('express');
var router = express.Router();

const pg = require('pg');


const user = 'postgres';
const host = 'localhost';
const database = 'ball-fight';
const password = 'martial5';
const port = '5432';

const pool = new pg.Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
});

/* GET users listing. */
router.post('/loginService', (request, response, next) => {
    const { username } = request.body;
    const { password } = request.body;
    const queryLogin = `SELECT id from player where username = '${username}' AND password = '${password}'`;
    pool.query(queryLogin, (error, results) => {
        if (error) response.send(error);
        else if (results.rowCount > 0) {
            response.send(results);
        } else {
            response.send('Error');
        }
    });
});



module.exports = router;
