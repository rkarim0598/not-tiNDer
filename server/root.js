const run = require('./db/query');
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
        await new Promise(r => setTimeout(r, 250));
        checkUser(user);
        return await Match.findMatchWithUser(user, id);
    },
    findUserOneWayMatches: async ({}, { user }) => {
        checkUser(user);
        return await Match.findUserOneWayMatches(user);
    },
    findOneWayMatchesWithUser: async({}, { user }) => {
        checkUser(user);
        return await Match.findOneWayMatchesWithUser(user);
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
    login: async ({ email, password }, { req, res }) => { // can access user info through context
        let results = await run(
            'select password, joined from users where user_id = :email',
            [email]
        );

        if (results.rows && results.rows.length === 1) { // indicates we have at least one user with given username
            // bcrypt's pwd hash contains the salt to has given password with, so can
            // just use bcrypt.compare to see if entered password is correct
            const valid = await bcrypt.compare(password, results.rows[0]['PASSWORD']);

            if (valid) { // passwords match
                let token = jwt.sign({
                    id: email
                }, 'shouldchangethis', { expiresIn: 3600000 }) /// 60 is for 60 seconds, can enter 1w, 1y, 60 * 60, etc

                res.cookie('jwtAuth', token, { maxAge: 3600000, httpOnly: true }); //TODO secure: true

                return User.findById(email);
            }
        }
        throw new Error('Invalid username or password');
    },
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
        checkUser(user);
        const match = await Match.create({ ...input, user_id: user });
        pubsub.publish(MATCHES_TOPIC, {match});
        return match;
    },
    createBlock: async ({ input }, { user }) => {
        return await Block.create({ blockee: input.other_user_id, blocker: user });
    },
    setupUser: async ({ input }, { user }) => {
        checkUser(user);
        await Promise.all(input.photos.map(async photo => {
            // TODO is this the best way?
            console.log(photo.file);
            Photo.create({ photo: photo.file.createReadStream(), mimetype: photo.file.mimetype, user_id: user });
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
    message: ({id}, {user}) => {
        console.log(id, user.id);
        return pubsub.asyncIterator(MESSAGES_TOPIC);
    },
    // message: graphqlsub.withFilter(() => pubsub.asyncIterator(MESSAGES_TOPIC), ({message}, {id}, {user}) => {
        //TODO check for proper user and id
        // return true;
    // }),
    
    match: graphqlsub.withFilter(() => pubsub.asyncIterator(MATCHES_TOPIC), ({match}, {id}, {user}) => {
        //TODO check for proper user and id
        return true;
    }),
};

module.exports = { ...queries, ...mutations, ...subscriptions };