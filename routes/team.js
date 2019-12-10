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

router.get('/getListTeam', (request, response, next) => {
    const queryGetListTeam = `SELECT * from team`;
    pool.query(queryGetListTeam, (error, results) => {
        if (error) {
            response.send(error);
        } else {
            response.send(results);
        }
    })
})

router.post('/createTeam', (request, response, next) => {
    const { codeTeam, teamName, id_login } = request.body;
    console.log(request.body);
    const queryCreateTeam = `INSERT INTO team(code_name, name) VALUES('${codeTeam}','${teamName}') RETURNING id`;
    pool.query(queryCreateTeam, (error, results) => {
        if (error) {
            response.send(error);
        } else {
            console.log(results.rows[0].id)
            response.json(results)
            pool.query(`UPDATE player SET team_id='${results.rows[0].id}', captain=1 WHERE id='${id_login}'`, (error, results) => {
                if (error) {
                    response.send(error);
                } else {
                    // response.send(results)
                    // console.log('ok')
                }
            })
        }
    })
})

router.post('/getListPlayer', (request, response, next) => {
    const { id_team } = request.body;
    const queryGetPlayer = `SELECT * FROM player WHERE team_id='${id_team}'`;
    pool.query(queryGetPlayer, (error, results) => {
        if (error) throw error;
        else {
            response.send(results);
        }
    })
})

router.post('/getDataTeam', (request, response, next) => {
    const { id_team } = request.body;
    const queryGetDataTeam = `SELECT * FROM team WHERE id='${id_team}'`;
    pool.query(queryGetDataTeam, (error, results) => {
        if (error) throw error;
        else {
            response.send(results);
        }
    })
})

router.post('/requestAddTeam', (request, response, next) => {
    const { id_sender, id_receiver, type } = request.body;
    console.log(id_sender, id_receiver, type);
    const queryRequest = `INSERT INTO record(id_sender,id_receiver, type_request, solved) VALUES('${id_sender}', '${id_receiver}',1,0)`;
    pool.query(queryRequest, (error, results) => {
        if (error) throw error;
        else {
            response.send(results)
        }
    })
})

router.post('/getNotification', (request, response, next) => {
    // const solved = 0;
    const { id_receiver } = request.body;
    const queryGetNoti = `SELECT * FROM record WHERE id_receiver='${id_receiver}' AND solved=0`;
    pool.query(queryGetNoti, (error, results) => {
        if (error) throw error;
        else {
            response.send(results);
        }
    })
})

router.post('/addToTeam', (request, response, next) => {
    // const solved = 1;
    const { id_record, id_sender, id_team, type, answer } = request.body;
    const queryAddToTeam = `UPDATE player SET team_id='${id_team}', captain=0 WHERE id='${id_sender}'`;
    if (answer === 1) {
        pool.query(queryAddToTeam, (error, results) => {
            if (error) throw error;
            else {
                response.json(results);
                const queryUpdateRecord = `UPDATE record SET solved=1 WHERE id_record='${id_record}'`;
                pool.query(queryUpdateRecord, (results, error) => {
                    if (error) throw error;
                    else {
                    }
                })
            }
        })
    }

})

router.post('/training', (request, response, next) => {
    const { date_training, team_id, type } = request.body;
    console.log(date_training, team_id)
    const queryTraining = `INSERT INTO record (team_id, date_training, type_request) VALUES ('${team_id}','${date_training}','${type}') `;
    pool.query(queryTraining, (results, error) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log(results)
            response.json(results)
        }
    })

})

router.post('/getTrainingDate', (request, response, next) => {
    const { team_id } = request.body;
})

module.exports = router;