let { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
    type User {
        user_id: String!,
        password: String!,
        first_name: String,
        last_name: String,
        gender_id: Int,
        bio: String,
        nickname: String,
        confirmed_account: String,
        reset_token: String,
        dorm: String,
        joined: String
    }
    type ReturnStruct {
        failure: Boolean,
        message: String,
        data: String
    }
    type Query {
        hello: ReturnStruct,
        login(email: String, password: String): ReturnStruct
    }
    type Mutation {
        createUser(input: NewUserInput): ReturnStruct
    }
    input NewUserInput {
        user_id: String,
        password: String,
        first_name: String,
        last_name: String
    }
`);

module.exports = schema;