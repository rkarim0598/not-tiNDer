const oracledb = require('oracledb');
const dbConfig = require('./dbconfig');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function run(query, bindList) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const results = await connection.execute(
            query,
            bindList,
            { autoCommit: true } // necessary for changes to actually store in the db, set to false if you don't want changes to persist in db
        )

        return results;
    } catch (error) {
        console.log(error);
        return { error }
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function load() {
    let data = await readFile('../sql-funcs/allusers.csv', 'utf8');
    let userList = data.split('\n').map(datum => datum.split(','));
    for (let i in userList) {
        let hash = bcrypt.hashSync(userList[i][1], 8);
        userList[i][1] = hash;
        let results = await run(
            'insert into users (user_id,password,first_name,last_name,gender_id,bio,nickname,confirmed_account,reset_token,dorm,joined)' +
            'values (:id, :pw, :fn, :ln, :gi, :b, :nn, :ca, :rt, :d, :j)',
            userList[i]
        )
        console.log(results);
    }
}

load();