'use strict';
import request from 'request';
import rq from 'request-promise';

const headers =
    {
        'Postman-Token': '05d518a1-0234-d1eb-e01f-f7f0456d368e',
        'Cache-Control': 'no-cache',
        Authorization: 'Basic Q0NNU19CQU1CTzp0JEhvVzBYelhvVEpUSnc='
    };

const baseURL = 'https://nst35-gws.dss.gov.au/childcare/ccms';

const createRequest = (method, invokeURL, payLoad) => {
    let stringpayLoad = payLoad.replace(/\:/g, ': ');
    console.log("Processed createRequest " + stringpayLoad);

    var request = {
        method: method,
        url: `${baseURL}${invokeURL}`,
        headers: headers,
        body: ' ' + stringpayLoad + ' '
    };

    return request;

}
export const ccitsInvoke = (invokeURL, payLoad) => {
    const invokeRequest = createRequest('POST', invokeURL, payLoad);
    return rq(invokeRequest);
}



