'use strict';
import { ccitsInvoke } from './httphelper';
import { updateResponsePayLoad } from './dbhelper';
import AWS from 'aws-sdk'
const parse = AWS.DynamoDB.Converter.output;
//import {updateResponsePayLoad} from "./dbhelper";

exports.invoke = async (event, context, callback) => {
  event.Records.forEach(async (record) => {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);

    if (record.eventName == 'INSERT') {

      const detailRecord = parse({ "M": record.dynamodb.NewImage });
      console.log('DynamoDB Record:', detailRecord);


      var invokeURL = detailRecord.invokeURL;
      var Id = detailRecord.Id;
      var requestPayLoad = detailRecord.requestPayLoad;
      var isAsynch = detailRecord.async;

      console.log("Invoke URL: " + invokeURL);
      console.log("Id: " + Id);
      console.log("requestPayLoad" + requestPayLoad);
      console.log("isAsynch" + isAsynch);
      if (isAsynch) {
        try {
          await ccitsRestInvoke(invokeURL, requestPayLoad, Id);
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
      }

      callback(null, `Successfully processed ${event.Records.length} records and invoked the CCITS rest`);
      return;
    }
  });

}



export const ccitsRestInvoke = async (invokeURL, requestPayLoad, Id) => {
  let ccitsResponse
  try {
    ccitsResponse = await ccitsInvoke(invokeURL, requestPayLoad);
  }
  catch (err) {
    console.error(`Error performing ccits REST invoke with requestPayLoad : ${requestPayLoad} and invokeURL : ${invokeURL}`);
    console.error(err);
    throw err;
  }

  finally {
    try {
      const ccitsResponseObject = JSON.parse(ccitsResponse);
      return updateResponsePayLoad(Id, ccitsResponse, ccitsResponseObject.ReturnError);
    }
    catch (err) {
      console.log(`Error performing persistence of ccits response for request with with requestPayLoad : ${requestPayLoad} and invokeURL : ${invokeURL}`);
      console.error(err);
      throw err;
    }
  }
}





