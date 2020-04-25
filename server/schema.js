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
        joined: String
    }
    type Residence {
        residence_id: String!,
        name: String!
    }
    type Gender {
        gender_id: String!,
        name: String!
    }
    type ReturnStruct {
        failure: Boolean,
        message: String,
        data: String
    }
    type Query {
        hello: ReturnStruct,
        login(email: String, password: String): ReturnStruct,
        findUserById(id: String): User!,
        findGenders: [Gender!]!,
        findResidences: [Residence!]!
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