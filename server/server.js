require('dotenv').config();
let express = require('express');
let cors = require('cors');
let graphqlHTTP = require('express-graphql');
let { buildSchema } = require('graphql');

//let whitelist = ['35.173.0.116:8121'];
let corsOptions = {
    origin: function(origin, callback) {
	if (whitelist.indexOf(origin) !== -1) {
	    callback(null, true);
	} else {
	    callback(new Error('Not allowed by CORS'));
	}
    }
}

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
let root = {
  hello: () => {
    return 'Hello world!';
  },
};

let app = express();
app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(process.env.PORT); // this should be your port number, set in .env file
console.log(`Running a GraphQL API server at http://localhost:${process.env.PORT}/graphql`);
