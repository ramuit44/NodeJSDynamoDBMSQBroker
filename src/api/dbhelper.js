'use strict';
var AWS = require("aws-sdk");
var dynamoDb = new AWS.DynamoDB.DocumentClient()
AWS.config.setPromisesDependency(require('bluebird'));
const table = "InvocationDetails";

    

    export const updateResponsePayLoad = async (Id, responsePayload, error) => {

        let status = error ? "error" : "success";
        if(responsePayload.includes("FaultCode")|| responsePayload.includes("ValidationError"))  status = "error";
        var params = {
            TableName: table,
            Key: {
                "Id": Id,

            },
            UpdateExpression: "set responsePayLoad = :r, ccitsStatus = :s",
            ExpressionAttributeValues: {
                ":r": responsePayload,
                ":s": status
            },
            ReturnValues: "UPDATED_NEW"
        };

        console.log("Updating the item...");
        return dynamoDb.update(params).promise();
    }



    export const  addInvocationDetail = async (record) => {
        {
            console.log('Submitting Invocation record');
            const recordInfo = {
                TableName: table,
                Item: record,
            };
            return dynamoDb.put(recordInfo).promise().then(res => record);

        };

    }


