let { buildSchema } = require('graphql');

//TODO should move towards something like in https://blog.logrocket.com/handling-graphql-errors-like-a-champ-with-unions-and-interfaces/

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
    scalar Upload
    type User {
        user_id: String!,
        password: String!,
        first_name: String,
        last_name: String,
        biography: String,
        nickname: String,
        confirmed_account: String,
        reset_token: String,
        residence: Residence,
        gender: Gender,
        joined: String,
        matches: [Match!]!,
        avatar: Int,
        photos: [Int!]!,
        gender_interests: [Gender!],
        blocks: [User!],
        personality_id: String
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
        matched_with_user: String,
        messages: [Message!]!,
        matched_back: Boolean!,
        latest_message: Message
    }
    type Message {
        message_id: Int!,
        match_id: Int!,
        content: String!,
        timestamp: String!,
        sender: User!,
        receiver: User!,
        latest_message: String
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
        biography: String,
        nickname: String,
        residence_name: String,
        personality_id: String,
        avatar: Int
        photos: [Int!]!
    }
    type Event {
        event_id: Int!,
        name: String!,
        user_id: String!,
        location: String!,
        sdate: String!,
        description: String!,
        photo: String
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
        findMatchByUserId(id: String!): Match,
        findUserOneWayMatches: Match,
        findOneWayMatchesWithUser: Match
        findRecommendations(event_id: Int): [Recommendation!]!,
        findEvents: [Event!]!
    }
    type Mutation {
        createUser(input: NewUserInput): ReturnStruct
        createMessage(input: MessageInput): Message,
        createMatch(input: MatchInput): Int,
        createBlock(input: MatchInput): Int
        setupUser(input: SetupUserInput): ReturnStruct,
    }
    type Subscription {
        match: Match!,
        message(id: String!): Message!
    }
    input NewUserInput {
        user_id: String,
        password: String,
        first_name: String,
        last_name: String
    }
    input MessageInput {
        receiver_id: String!,
        content: String!
    }
    input MatchInput {
        other_user_id: String!,
        event_id: Int,
    }
    input SetupUserInput {
        gender_id: Int,
        desiredGenders: [Int],
        biography: String,
        residence_id: Int,
        seriousness: Int,
        photos: [Upload],
        personality_id: String
    }
`);

module.exports = schema;