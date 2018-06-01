# Introduction
The service implementation is the real core of this project. On the one hand it combines data from the SAP API hub and on the other hand exposes the merged data to be consumed by callers to display in either application or as part of a user interface.

In this section we will examine how the data is obtained, aggregated and output to clients. This will illustrate how easy it is to build a mashup type application using the SAP API hub and then deploy it to cloud foundry.


# The Data
The intention here is that the employee/candidate data that is held in the SuccessFactors system will be linked to the concur system via a primary key. This will allow the entity in SuccessFactors to be linked to the entity in Concur and of course this leads to the silo breaking and a new business model can be created from the union of these two sources of data. The Job Requisition record will hold the details about the Division, Department, Location and Country that the requisition was raised in. We use this to aggregate the incurred expenses. The JobApplication record will contain the details about the candidate who is attending the interview. This will hold the candidate id which is the key to identify the candidate's expenses in Concur. 

Since we are using the SAP API Hub for the API consumption and that this is backed by sand box real systems, these have been loaded with some real data. The SuccessFactors system has been loaded with 48 Job Interviews and with 15 unique candidates. The Concur system has also been loaded with multiple expense reports for the candidates in SuccessFactors so there is data that can tell the whole end to end story.

For this example we have not supplied a UI to create the job interview and to submit expense reports but these should not be too difficult to create assuming that there is access to write to the sandbox. Typically a candidate would have been expected to have an account created to them. They would be supplied with a login and would submit their expenses via this account.
 

## Modelling
For the information we want to transfer to the consumers we want to aggregate the data into a number of dimensions to make the data make more sense.

At the moment four dimensions are examined:

1. *Country* - the expenses breakdown incurred by the countries that had candidates coming for interviews.
2. *Location* - the expenses breakdown by location incurred for the locations that interviewed candidates.
3. *Division* - the divisions that had candidate interviews broken down by division across the organization. 
4. *Department* - the individual departments that had candidate interviews broken down by department across the organization.
 

These are the dimensions that we currently track, however there is no reason why additional dimensions could not be added easily, in particular a time dimension springs to mind and not just for total expenses but also for each of the existing four dimensions.


## Information Flows
In the service the data flows have been illustrated already in the business document but we will look at the actual flows in code and examine how they work. The focus of the information flows will however be done in JavaScript and NodeJS.

Since we have adopted and API first approach to development the API is the core of the application and can be accessed by and REST based application including a browser or REST client such as [PostMan](https://wwww.getpostman.com).

As OpenAPI was adopted as the layer of choice when defining our API it makes it natural to build on this. If the browser goes to the service root with a path of the '/docs', this will open the  API viewer. From here the caller will be able to run/ or will be shown the ways to call the API. The API can be called from the browser and the returned data response viewed in the web page. This becomes an important tool for the developer as they can experiment with the different API's and learn which imports produce which outputs. 


There are three basic flows in the system at the moment:

1. *Refresh* - The refresh flow is where the majority of the complexity resides. This process flow uses the API Hub to get the list of Job Interviews in the SuccessFactors system and extracts the unique candidates who have attended interviews. Once we have the list of unique candidates the Concur system is used to resolve the candidate id to a Concur Login Id. The Concur LoginId is then used to retrieve the submitted expense reports in the system. Once these totals have been obtained the data is then stored in a local file so that the backend is not called every time a client connects.
 
2. *Value* - The value flow will handle the case where totals are requested for the department, division, location or country. The service will fulfill the request for the local cache which is always guaranteed to be present. It is up to the caller to ensure that they call Refresh in a periodic manner so as to ensure the latest costs are reflected correctly.

3. *Status* - The status flow will return status information back to the caller. The primary purpose of this flow is to inform the caller about when the last refresh event occurred.

  
By far and away the most important flow is that of the *Refresh* flow that is used to actually download the data and turn it into a matrix that is stored internally to be delivered when callers request it.

# API Consumption
The implementation of the service calls three specific APIs in the SAP API Hub. The APIs that are of interest are the following:

1. *SuccessFactors Job Interview API* - 
2. *Concur User API* - 
3. *Concur Expense Report API* - 

These three API's together allow us to reconcile candidates from Job Interviews within the SuccessFactors company with the expenses submitted by the candidates after their interviews.
 
## Caching
The SAP API Hub is rate limited both in the number of concurrent queries and in the number of queries per minutes so it is important that any service using the SAP API Hub is cognisant of this fact and deal with the requests they are making in a manner that will not result in the API hub rejecting some or all of the requests being made.

To make sure the system correctly handles this case the system issues all the calls to the API hub in a synchronous manner via the [async](https://www.npmjs.com/package/async) library. This library makes working with asynchronous calls simple by converting them into synchronous calls so that each call executes after the current one completes.

Using the "async" library will ensure the calls to the SAP API hub will easily fall under the rate limits on the portal and the calls will not fail to get the data.

Now that the calls from the service to the SAP API Hub have been rate limited there will be no problem retrieving the data, however the case where there are multiple clients all connecting at once to the service and then these calls are forwarded to the SAP API Hub is still a problem. To handle this scenario the application caches the data locally and then when a request is received from a client the cached data is returned. It is the user responsibility to use the status command to identify the last time the data was refreshed from the backend and then decide if a refresh is required or not. This in itself could substantially reduce cost and load on the landscapes.

The data itself could be persisted any number of ways, however for this exercise the data is just persisted to a flat file. There is however no reason why the developer could not store the data in SAP HANA or PostgreSQL or any other common database.


# Code
The code was generated by the SAP API Designer from the OpenAPI YAML file. The code that was generated was for NodeJS, though there are plenty of other code generated servers that could have been used including the enterprise favourite, Spring Boot.

The source code for the application can be found in the service folder. 

As with any Nodejs project the dependencies can  be found in the package.json file, so from the service folder, you will need to run

```
npm install
```

to install the dependencies that will be used by the application.

Broadly speaking the functionality is built in layers and each layer has a specific objective. The overarching theme however is that the developer needs to understand [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and how they work.

There is a very good [YouTube tutorial by Kyle Young](https://youtu.be/g90irqWEqd8) on using promises so if you hav'nt yet got round to understanding promises or want to learn more about how promises can be used to simplify your code, watch the video beforehand as we make extensive use of promises in the code.

## api
This folder just has the OpenAPI YAML file that holds our API definition. When running the server, if you go to /docs the documentation for the API will be presented along with a "try it out!" button to test the API call.

This file is also the file we imported into the SAP API Designer to show the editor experience and how the API was developed.

## controllers
The controllers in this folder form the bridge between the HTTP server and the backend services. This fetches the data from the database or refreshes the data from the backend via a call to the services. The returned data is then written to the HTTP response object to be returned to the caller.

## service
The methods in this folder contain our functions to get the data from the backend. This is the actual implementation of the method that was created in the OpenAPI file. This however mostly just pushes the request to the backend modules where all the real work and complexity lie. 

Note that the service code can be simplified by removing an extra layer of promises but this was left in to make the code clearer
The code could look like

```

exports.getExpensesByCountry = function() {
        return data.totals('country')
};

```

which just returns a promise back to the controller.

## utils
This holds our utility functions. In this folder we have methods to round a number, split a string into a specific format that was returned by SuccessFactors and of course code to write the data from the service call to the response object to be returned to the caller.

## backend
Where the complexity of the implementation lies resides in this folder. There are a number of areas that need to be explained so that the data flow can be easily understood.

### db.js
This module is use to provide an interface to the underlying database implementation. In our implementation the database is just  a flat file, however there is no reason why this cannot be extended to a real database with little effort. This allows the Concur and SuccessFactors data to be stored and restored from the underlying system as well as providing some metrics for the database

### data.js
This module does the calculations for the core services. Specifically it will return the data for the reports and users as well as totals and aggregates for the relevant fields we are interested in. These fields are division, department, location and country. It is worth looking through the code, especially the *totalsByFieldImpl* to see the data is loaded asynchronously and then the users and reports are combined to give the data totals.

 ### operations.js
 The operations module is the second most important module in the system. This has the implementation of the *downloadDataImpl* method that is used to download the data from the backend SuccessFactors and Concur systems via the SAP API Hub. The *downloadDataImpl* method has some text book implementations of consuming services and clearly shows how the data from Concur and SuccessFactors can be downloaded asynchronously and then merged together and stored in the db to cache the data for subsequent requests by this and other clients.
 
 ### api.js
 the last module is the most important. This holds the code used to access the SAP API Hub. The loadConcurReportsImpl loads the reports from the API Hub using the Concur Expenses API. The loadSFSFUsersImpl loads the job interviews from the SuccessFactors API and extracts the unique candidate ids from the interviews. Finally the mapUserIdToLoginIdImpl takes the SuccessFactors CandidateId retrieved previously and converts this to a Concur LoginID so that the candidate attending the interview can be linked to the expenses they submitted.
   
# Running the application

The application can be run locally or pushed to cloud foundry. To make testing easier the webapp can be hosted locally and then it can be easily debugged without the need to deploy each time to Cloud Foundry


Before running the web server you will need to open the ExpensesModel.js file in the model folder and change the CLOUD_FOUNDRY_API_ENDPOINT variable to point to your service that is either running locally or is running on cloud foundry. It is important that the correct URL that is used to access the service is setup so the model can load the data.

## Running Locally

Before the application can be run locally an environment variable needs to be set called "BUSINESS_HUB_API_KEY" and this is used when making secured calls to the SAP API Hub. It is very important that this environment variable is set otherwise the process will abort when a request is made to the SAP API Hub as this is a mandatory value.

To start the server, the Nodejs runtime will need to execute the index.js file that holds the code for the http server.node.
Changing to the service folder there are two ways to execute the service application.

Node can be run directly: 

```
node index.js
```

or NPM can be used to launch the process. The NPM route will check to ensure the dependencies are present and up to date and then execute the server so this is the preferable route.

```
npm start
```

This will start the server and show it is waiting for connections. Using the Swagger-ui the API can now be tested. Of course it is also possible to use a REST client such as postman to test but for this example let us use the tooling swagger provided when the application was generated! 

```
Loading current state from ./.db.json
The DB file does not exist which is okay
Your server is listening on port 10010 (http://localhost:10010)
Swagger-ui is available on http://localhost:10010/docs
```

## Running on Cloud Foundry

Running the application from cloud foundry is normally done when the service is created in cloud foundry through the 

```
cf push
```

command as this pushes the service and the dashboard in one operation. 

Before continuing however the SAP API Hub key needs to be set. This can be by updating the BUSINESS_HUB_API_KEY value in the manifest.yml file before pusing the applications. The alternative method can be done after deploying the application to cloud foundry. Open the SAP Cloud Platform Cockpit and goto your default space where the two services can be found. Open the *concur-sfsf-services* application and go to the User Variables panel on the right. Change the BUSINESS_HUB_API_KEY value to use your API Hub key. Note that changing the BUSINESS_HUB_API_KEY this way will require that you back and restart the application.

 
If the SAP API Hub key is not set then the *concur-sfsf-services* process will log an error and terminate.

## Completing the exercise
Using a browser, open either the cloud foundry instance or the localhost instance and append the /docs path to the URL to access the Documentation UI Dashboard. From this the various methods can be tested such as from the operations section, the *refresh* command can be executed and then the users and reports can be viewed.
 
## Other sources of information

There is further supporting videos on the [SAP HANA Academy Video Channel on YouTube](https://www.youtube.com/user/saphanaacademy) for your viewing that explain some of the code in more details in bitesize pieces.



