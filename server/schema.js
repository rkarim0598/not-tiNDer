let { buildSchema } = require('graphql');

//TODO should move towards something like in https://blog.logrocket.com/handling-graphql-errors-like-a-champ-with-unions-and-interfaces/

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
    type User {
        user_id: String!,
        password: String!,
        first_name: String,
        last_name: String,
        bio: String,
        nickname: String,
        confirmed_account: String,
        reset_token: String,
        residence: Residence,
        gender: Gender,
        joined: String,
        matches: [Match!]!,
        photos: [Photo!]!,
        gender_interests: [Gender!],
        blocks: [User!]
    }
    type Residence {
        residence_id: String!,
        name: String!,
        on_campus: Int!,
        lat: Float,
        lng: Float
    }
    type Gender {
        gender_id: String!,
        name: String!
    }
    type Match {
        match_id: Int!,
        other_user: User!,
        messages: [Message!]!
    }
    type Message {
        message_id: Int!,
        match_id: Int!,
        content: String!,
        timestamp: String!,
        sender: User!
    }
    type Photo {
        photo_id: Int!,
        user_id: String!,
        photo: String!
    }
    type Recommendation {
        user_id: String!,
        first_name: String!,
        last_name: String!,
        gender_id: String,
        bio: String,
        nickname: String,
        residence_name: String,
        personality_results: String
    }
    type ReturnStruct {
        failure: Boolean,
        message: String,
        data: String
    }
    type Query {
        hello: ReturnStruct,
        login(email: String, password: String): ReturnStruct,
        findUser: User,
        findUserById(id: String!): User,
        findGenders: [Gender!]!,
        findResidences: [Residence!]!,
        findMatches: [Match!]!,
        findMatchById(id: Int!): Match,
        findRecommendations(id: String): [Recommendation!]!
    }
    type Mutation {
        createUser(input: NewUserInput): ReturnStruct
        createMessage(input: MessageInput): Message,
        createMatch(input: MatchInput): Int,
        createBlock(input: MatchInput): Int
    }
    input NewUserInput {
        user_id: String,
        password: String,
        first_name: String,
        last_name: String
    }
    input MessageInput {
        match_id: Int!,
        content: String!
    }
    input MatchInput {
        other_user_id: String!,
        event_id: Int,
        user_id: String!
    }
`);

module.exports = schema;