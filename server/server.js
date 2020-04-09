var express = require('express');
var cors = require('cors');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

//var whitelist = ['35.173.0.116:8121'];
var corsOptions = {
    origin: function(origin, callback) {
	if (whitelist.indexOf(origin) !== -1) {
	    callback(null, true);
	} else {
	    callback(new Error('Not allowed by CORS'));
	}
    }
}

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

var app = express();
app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(process.env.SERVER);
console.log(`Running a GraphQL API server at http://localhost:${process.env.SERVER}/graphql`);
