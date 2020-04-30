const run = require('./db-query');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Block = require('./models/block');
const Gender = require('./models/gender');
const Match = require('./models/match');
const Message = require('./models/message');
const Residence = require('./models/residence');
const Recommendation = require('./models/recommendation');
const Event = require('./models/event');
const Photo = require('./models/photo');
const dbConfig = require('./dbconfig');
const oracledb = require('oracledb');
const graphqlsub = require('graphql-subscriptions');

const pubsub = new graphqlsub.PubSub();
const MESSAGES_TOPIC = 'messages';
const MATCHES_TOPIC = 'matches';

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
    if (!user) {
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
            'select password, joined from users where user_id = :email',
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

            res.cookie('jwtAuth', token, { maxAge: 3600000, httpOnly: true }); //TODO secure: true

            return {
                failure: false,
                data: results.rows[0]['JOINED'],
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
    findUser: async ({ }, { user }) => {
        checkUser(user);
        return await User.findById(user);
    },
    findUserById: async ({ id }) => {
        return await User.findById(id);
    },
    findMatches: async ({ }, { user }) => {
        checkUser(user);
        return await Match.findAllByUserId(user);
    },
    findMatchByUserId: async ({id}, {user}) => {
        await new Promise(r => setTimeout(r, 500));
        checkUser(user);
        return await Match.findMatchWithUser(user, id);
    },
    findRecommendations: async ({ event_id }, { user }) => {
        checkUser(user);
        return await Recommendation.findRecommendations({ event_id, user_id: user });
    },
    findEvents: async () => {
        return await Event.findAll();
    }
}

let mutations = {
    createUser: async ({ input }) => {
        // hash password
        let hash = await hasher(input.password);
        let results = await run(
            'insert into users (user_id,password,first_name,last_name,gender_id,biography,nickname,confirmed_account,reset_token,residence_id,joined)' +
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
    createMessage: async ({ input }, { user }) => {
        checkUser(user);
        const message = await Message.create({...input, sender_id: user});
        pubsub.publish(MESSAGES_TOPIC, {message});
        return message;
    },
    createMatch: async ({ input }, { user }) => {
        return await Match.create({ ...input, user_id: user });
    },
    createBlock: async ({ input }, { user }) => {
        return await Block.create({ blockee: input.other_user_id, blocker: user });
    },
    setupUser: async ({ input }, { user }) => {
        checkUser(user);
        let connection = await oracledb.getConnection(dbConfig);
        await Promise.all(input.photos.map(async photo => {
            // TODO is this the best way?
            console.log(photo.file);
            Photo.create({ photo: photo.file.createReadStream(), mimetype: photo.file.mimetype, user_id: user }, connection);
        }));
        let results = await run(
            'update users set gender_id = :gender, biography = :biography, residence_id = :residence, personality_id = :personality_id, joined = :joined where user_id = :user_id',
            [input.gender_id, input.biography, input.residence_id, input.personality_id, 'Y', user]
        )

        if (results.error) {
            return {
                failure: true,
                message: results.error.errorNum === 1
                    ? `${user} could not be updated`
                    : results.error.message
            }
        } else {
            for (let i in input.desiredGenders) {
                let res;
                res = await run(
                    'insert into gender_interests (user_id, gender_id)' +
                    'values (:user_id, :gender_id)',
                    [user, input.desiredGenders[i]]
                )

                if (res.error) {
                    return {
                        failure: true,
                        message: `${user}'s gender interests could not be updated`
                    }
                }
            }
            return {
                failure: false,
                message: `${user} has been updated`
            }
        }
    }
}

let subscriptions = {
    // message: ({id}, {user}, y, z) => {
    //     return pubsub.asyncIterator(MESSAGES_TOPIC);
    // },
    message: graphqlsub.withFilter(() => pubsub.asyncIterator(MESSAGES_TOPIC), ({message}, {id}, {user}) => {
        //TODO check for proper user and id
        return true;
    }),
};

module.exports = { ...queries, ...mutations, ...subscriptions };