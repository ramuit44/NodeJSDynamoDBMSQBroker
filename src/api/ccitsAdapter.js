'use strict';

import uuid from 'uuid';
import AWS from 'aws-sdk'
import { addInvocationDetail } from './dbhelper';
import { ccitsRestInvoke } from './ccitsGateway';
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();
exports.invoke = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  //const requestBody = event.body;
  const invokeURL = requestBody.invokeURL;
  let requestPayLoad = requestBody.payLoad;
  const async = requestBody.async !== false;
  const responsePayLoad = {};

  console.log(requestPayLoad);

  let response;
  let ccitsGatewayResponse;

  try {
    response = await addInvocationDetail(formatInvocationDetail(requestPayLoad, invokeURL, async));
  } catch (err) {
    console.error(`Error performing addInvocationDetail with requestPayLoad : ${requestPayLoad} and invokeURL : ${invokeURL}`);
    console.error(err);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to submit record with invokeURL ${invokeURL}`,
        err: err
      })
    });
  }

  if (async) {
    console.log(`Sucessfully submitted record for the url ${invokeURL} with record  ${response}`);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Sucessfully submitted record for the url ${invokeURL}`,
        recordId: response.Id
      })
    });
    return;
  }

  //In case of synch operations
  try {
    ccitsGatewayResponse = await ccitsRestInvoke(invokeURL, requestPayLoad, response.Id);
  }
  catch (err) {
    const errMessage = `Error performing ccits gateway submit with requestPayLoad : ${requestPayLoad} and invokeURL : ${invokeURL}`;
    console.error(errMessage);
    console.error(err);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        message: errMessage
      })
    });
    return;
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: `Sucessfully submitted record for the url ${invokeURL}`,
      recordId: response.Id,
      ccitsResponse: ccitsGatewayResponse
    })
  });
}



const formatInvocationDetail = (requestPayLoad, invokeURL, async) => {
  const timestamp = new Date().toUTCString();
  return {
    Id: uuid.v1(),
    requestPayLoad: requestPayLoad,
    responsePayLoad: {},
    invokeURL: invokeURL,
    async: async,
    submittedAt: timestamp,
    updatedAt: timestamp,
    ccitsStatus: "invoked"

  };
};
