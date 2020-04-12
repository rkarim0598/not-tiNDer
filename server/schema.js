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
    type Query {
        hello: String,
        login(email: String, password: String): String
    }
    type Mutation {
        createUser(input: NewUserInput): String
    }
    input NewUserInput {
        user_id: String,
        password: String,
        first_name: String,
        last_name: String
    }
`);

module.exports = schema;