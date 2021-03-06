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

/**
 * Set-up the channels for subscriptions and live updating
 */
const pubsub = new graphqlsub.PubSub();
const MESSAGES_TOPIC = 'messages';
const MATCHES_TOPIC = 'matches';

/**
 * Hashes the given text
 * @param {String} text the input 
 */
async function hasher(text) {
    // promisify the hash process so we can use async/await
    return await new Promise((resolve, reject) => {
        bcrypt.hash(text, 8, async (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        })
    })
}

/**
 * Simple function checking if the user is logged in throwing a consistent error
 * @param {Object} user the user object passed in context
 */
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

        if (results.rows && results.rows.length === 1) {
            // bcrypt's pwd hash contains the salt to has given password with, so can
            // just use bcrypt.compare to see if entered password is correct
            const valid = await bcrypt.compare(password, results.rows[0]['PASSWORD']);

            if (valid) {
                // passwords match
                let token = jwt.sign({
                    id: email
                }, process.env.JWT_SECRET, { expiresIn: 3600000 });

                res.cookie('jwtAuth', token, { maxAge: 3600000, httpOnly: true }); //TODO secure: true

                return User.findById(email);
            }
        }
        throw new Error('Invalid username or password');
    },
    logout: async ({}, { req, res }) => {
        checkUser(req.user);
        let token = jwt.sign({}, 'shouldchangethis', { expiresIn: 0 });
        res.cookie('jwtAuth', token, { maxAge: 0, httpOnly: true });

        return {
            failure: false,
            message: 'Logged out!'
        }
    },
    createUser: async ({ input }) => {
        if (!/\S+@(nd|saintmarys|hcc-nd).edu/.test(input.user_id)) {
            return {
                failure: true,
                message: 'Invalid email: must be ND/SMC/HC domain'
            }
        }

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
            await photo.promise;
            Photo.create({ photo: photo.file.createReadStream(), mimetype: photo.file.mimetype, user_id: user });
        }));
        if(Number.isNaN(Number(input.residence))) {
            input.residence = (await Residence.create({name: input.residence, on_campus: false})).residence_id;
        }
        if(Number.isNaN(Number(input.gender))) {
            input.gender = (await Gender.create({name: input.gender})).gender_id;
        }
        let results = await run(
            'update users set gender_id = :gender, biography = :biography, residence_id = :residence, personality_id = :personality_id, joined = :joined, nickname = :nickname, seriousness = :seriousness where user_id = :user_id',
            [input.gender, input.biography, input.residence, input.personality_id, 'Y', input.nickname, input.seriousness, user]
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
    message: graphqlsub.withFilter(() => pubsub.asyncIterator(MESSAGES_TOPIC), ({message}, {user}, {variableValues: {id}}) => {
        return !!user && (
            (message.sender_id === user.id && message.receiver_id === id)
         || (message.sender_id === id      && message.receiver_id === user.id)
        );
    }),
    match: graphqlsub.withFilter(() => pubsub.asyncIterator(MATCHES_TOPIC), ({match}, {user}) => {
        return !!user && (match.first_user === user.id || match.second_user == user.id);
    })
};

module.exports = { ...queries, ...mutations, ...subscriptions };
