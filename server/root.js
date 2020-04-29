const run = require('./db-query');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Gender = require('./models/gender');
const Match = require('./models/match');
const Message = require('./models/message');
const Residence = require('./models/residence');

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

function checkUser(user) {
    if(!user) {
        throw new Error('Not logged in');
    }
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
    login: async ({ email, password }, { req, res }) => { // can access user info through context
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
                id: email
            }, 'shouldchangethis', { expiresIn: 3600000 }) /// 60 is for 60 seconds, can enter 1w, 1y, 60 * 60, etc

            res.cookie('jwtAuth', token, {maxAge: 3600000, httpOnly: true}); //TODO secure: true
            
            return {
                failure: false,
                message: 'Successfully logged in'
            };
        }
        else { // indicates nonexistent username
            return {
                failure: true,
                message: 'Invalid username or password'
            }
        }
    },
    findGenders: async () => {
        return await Gender.findAll();
    },
    findResidences: async () => {
        return await Residence.findAll();
    },
    findUser: async ({}, {user}) => {
        checkUser(user);
        return await User.findById(user);
    },
    findUserById: async ({id}) => {
        return await User.findById(id);
    },
    findMatches: async ({}, {user}) => {
        checkUser(user);
        return await Match.findAllByUserId(user);
    },
    findMatchById: async ({id}, {user}) => {
        await new Promise(r => setTimeout(r, 500));
        checkUser(user);
        return await Match.findByMatchIdAndUser(id, user);
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
    },
    createMessage: async ({input}, {user}) => {
        checkUser(user);
        return await Message.create({...input, user_id: user});
    }
}

module.exports = { ...queries, ...mutations };