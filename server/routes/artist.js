const express = require('express');
const router = express.Router();
// Require the pg module:
const pg = require('pg');

// Create a pool object constructor.
const Pool = pg.Pool;

// Create our pool object using the above constructor:
const pool = new Pool({
  database: 'jazzy_sql', // the name of database, This can change!
  host: 'localhost', // where is your database?
  port: 5432, // the port for your database, 5432 is default for postgres
  max: 10, // how many connections (queries) at one time
  idleTimeoutMillis: 30000 // 30 second to try to connect, otherwise cancel query
});

// Log to our console when our pool object makes a connection:
pool.on('connect', () => {
  console.log('Postgresql connected');
});

// Log to our console when something makes our pool error out:
pool.on('error', (error) => {
  console.log('Error with postgres pool', error)
});


router.get('/', (req, res) => {
  const sqlText = 'SELECT * FROM artist;'
  pool.query(sqlText)
    .then((dbRes) => {
      const songsFromDb = dbRes.rows;
      res.send(songsFromDb)
    }).catch((dbErr) => {
      console.error(dbErr);
    });
});

router.post('/', (req, res) => {
  const newSong = req.body;
  const sqlText = (`
    INSERT INTO "artist"
      ("name", "birthdate")
    VALUES
      ($1, $2);
  `)
  const sqlValues = [
    newSong.name,
    newSong.birthdate,
  ]
  console.log(sqlText)
  pool.query(sqlText, sqlValues)
    .then((dbRes) => {
      res.sendStatus(201);  // OK, CREATED
    })
    .catch((dbErr) => {
      console.error(dbErr);
    })
});

module.exports = router;
