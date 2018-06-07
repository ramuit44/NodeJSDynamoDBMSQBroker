'use strict';
var AWS = require("aws-sdk");
var dynamoDb = new AWS.DynamoDB.DocumentClient();
const table = "InvocationDetails";
module.exports.get = (event, context, callback) => {
    const params = {
      TableName: table,
      Key: {
        Id: event.pathParameters.id,
      },
    };
  
    // fetch  from the database
    dynamoDb.get(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'application/json' },
          body: 'Couldn\'t fetch the Invocation details item.',
        });
        return;
      }
  
      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    });
  };