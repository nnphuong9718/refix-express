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
router.post('/getPersonalInfo', (request, response, next) => {
    const { id_login } = request.body;
    // console.log(id_login);
    const queryGetPersonalInfo = `SELECT * FROM player WHERE id='${id_login}'`;
    pool.query(queryGetPersonalInfo, (error, results) => {
        if (error) response.send(error);
        else {
            response.send(results);
        }
    })
})

router.post('/checkCaptain', (request, response, next) => {
    const { id_team } = request.body;
    console.log(id_team)
    let queryCheck = `SELECT id from player WHERE team_id='${id_team}' AND captain=1`;
    pool.query(queryCheck, (error, results) => {
        if (error) {
            console.log(error);
            response.send(error);
        } else {
            response.send(results)
        }
    })
})
module.exports = router;