# NodeJS Dynamo DB MSQ Broker #

CCITS Integration layer following a Decoupled Invocation pattern with AWS Lambda and serverless

### What is this repository for? ###

* Api gateway proxy with Lambda to take request and do a crud to dyanmo db
* Dynamo db streams to invoke the gatway lambda.
* Gateway lambda that takes input from stream and invokes the external webservice and records response to dynamo db.

### How do I get set up? ###

* yarn
* sls deploy

### Who do I talk to? ###

* Sriram
