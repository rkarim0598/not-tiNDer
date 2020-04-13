const oracledb = require('oracledb');
const dbConfig = require('./dbconfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

/**
 * 
 * @param {String} query 
 * @param {String[]} bindList 
 */
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
 * 
 * @param {String} plaintext 
 */
async function hasher(plaintext) {
    // promisify the hash process so we can use async/await
    return await new Promise((resolve, reject) => {
        bcrypt.hash(plaintext, 8, async (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        })
    })
}

let queries = {
    hello: async () => {
        let results = await run('select salpers_name from salesperson where salpers_name = \'Rodney Jones\'');
        return {
            failure: false,
            message: 'Got hello query',
            data: results.rows[0]['SALPERS_NAME']
        }
    },
    login: async ({ email, password }, context) => { // can access user info through context
        let results = await run(
            'select password from users where user_id = :email',
            [email]
        )

        if (results.rows.length === 1) { // indicates we have at least one user with given username
            // bcrypt's pwd hash contains the salt to has given password with, so can
            // just use bcrypt.compare to see if entered password is correct
            const valid = await bcrypt.compare(password, results.rows[0]['PASSWORD']);

            if (!valid) { // indicates password mismatch
                return {
                    failure: true,
                    message: 'Invalid username or password'
                }
            }

            let token = jwt.sign({
                id: email,
                email: email,
            }, 'shouldchangethis', { expiresIn: 60 }) /// 60 is for 60 seconds, can enter 1w, 1y, 60 * 60, etc
            return {
                failure: false,
                message: 'Successfully logged in',
                data: token
            };
        }
        else { // indicates nonexistent username
            return {
                failure: true,
                message: 'Invalid username or password'
            }
        }
    }
}

let mutations = {
    createUser: async ({ input }) => {
        // hash password
        let hash = await hasher(input.password);
        let results = await run(
            'insert into users (user_id,password,first_name,last_name,gender_id,bio,nickname,confirmed_account,reset_token,dorm,joined)' +
            'values (:id, :pw, :fn, :ln, null, null, null, null, null, null, null)',
            [input.user_id, hash, input.first_name, input.last_name]
        )
        return !results.error ?
            {
                failure: false,
                message: `${input.user_id} has been created`
            }
            :
            {
                failure: true,
                message: results.error.errorNum === 1 ?
                    'User already exists'
                    :
                    results.error.message
            }
    }
}

module.exports = { ...queries, ...mutations };