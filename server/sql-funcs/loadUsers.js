const oracledb = require('oracledb');
const dbConfig = require('../dbconfig');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const util = require('util');
const LoremIpsum = require('lorem-ipsum').LoremIpsum;
const dorms = require('./dorms.json');
const users = require('./users.json');

const lorem = new LoremIpsum({
    wordsPerSentence: {
        max: 10,
        min: 5
    }
})

const readFile = util.promisify(fs.readFile);

async function run(query, bindList = []) {
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

/**
 * insert each interest into gender_interest table
 * @param {String} user_id 
 * @param {[Number]} interest_array 
 */
async function loadGenderInterests(user_id, interest_array) {
    for (let i in interest_array) {
        let res = await run(
            'insert into gender_interests (user_id, gender_id) ' +
            'values (:user_id, :gender_id)',
            [user_id, interest_array[i]]
        )

        if (res.error) {
            console.log('error inserting');
            process.exit();
        }
    }
}

async function loadUsers() {
    // get list of personalities;
    let res = await run('select personality_id from personalities');
    let personalities = res.rows.map(p => p[0])

    for (let i in users) {
        console.log('Inserting ' + i + '...');
        for (let j in users[i]) {
            let interests = users[i][j][0];
            let personality = personalities[j % personalities.length];
            let dorm = dorms[i][j % dorms[i].length] + 1;
            let gender_id = i === 'males' ? 1 : 2; // CHANGE IF MORE GENDERS ADDED
            let name = users[i][j][1];
            let [first, last] = name.split(' ');
            let nickname = first[0] + last.substr(0, 5);
            let user_id = (nickname + '@nd.edu').toLowerCase();
            let bio = lorem.generateSentences(2);
            let hash = bcrypt.hashSync('password', 8);

            let results = await run(
                'insert into users (user_id,password,first_name,last_name,gender_id,biography,nickname,confirmed_account,reset_token,residence_id,joined,personality_id)' +
                'values (:id, :pw, :fn, :ln, :gi, :b, :nn, :ca, :rt, :d, :j, :p)',
                [user_id, hash, first, last, gender_id, bio, nickname,,, dorm,, personality]
            )

            if (results.error) {
                console.log([user_id, hash, first, last, gender_id, bio, nickname, dorm, personality])
                return;
            }

            // insert gender interests
            await loadGenderInterests(user_id, interests);
        }
    }
}

loadUsers();