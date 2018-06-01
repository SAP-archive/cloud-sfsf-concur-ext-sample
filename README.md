# Build a Recruitment & Travel Expense Management Dashboard

This application focuses on utilizing the data from both SuccessFactors (SFSF) for HR management and Concur for Expense Management. The data is joined together to provide an easy to consume summery that is created in the service and shown in a UI5 Analytic Page dashboard.

This application itself is composed of two projects. The first project is the API service that provides the aggregation of the SFSF and Concur data in a consumable API to callers. The second is the actual UI itself. This is used to show the data retrieved from the service in a dashboard.

The service is written in NodeJS and adopts an API-First approach to project development. This is accomplished through the use of OpenAPI, formerly called Swagger. The API is managed through node-swagger and implementations of the various REST services defined in the swagger API file have been provided.

When it comes to the UI that consumes the service: The UI has been written using SAPUI5 and it uses the classic SAP Fiori look and feel for the dashboard. The UI5 application is hosted using the staticfiles buildpack on cloud foundry and is delivered using an NGinx server.

## Source Code
All the source code has been supplied. The code is written in Javascript using NodeJS for the service and SAPUI5 for the client application.

The source code to the API service implementation can be found in the service folder.

The source code to the SAP UI5 application can be found in the dashboard folder. The SAPUI5 project uses SAP UI5 that is hosted via the SAP CDN and so does not need to be included with the project source code.


# Business Case Story
This idea came about as a result of how management can get an overview of their recruitment expenses. To do this the recruiting information from SuccessFactors is used to get a list of candidates. These candidates id's are then used to find the relevant expense reports that they submitted in Concur.

The totals for the countries, locations, departments and divisions are used to build a picture of where the recruitment money is being spent within the organization.

# Prerequisites

The following prerequisites are required in order to create the applications and run them on cloud foundry.

- *SAP Cloud Platform Account* - to install the applications the user is required to register at https://hanatrial.ondemand.com/
This will enable the trial for Cloud Foundry which is valid for 90 days.


- *API Hub Licence Key*
Go over to https://api.sap.com and create an account of login. Once logged in obtain a API key that will be used to access the API's from within the service via REST HTTP calls.  

  To learn how to get the API key see the tutorial on the tutorial navigator - https://www.sap.com/developer/tutorials/hcp-abh-getting-started.html

- *NodeJS 6.11.3 or later*
This must also include Node Package Manager or NPM that will be used to install and maintain packages.
To download the node runtime navigate over to https://nodejs.org/en/ then download and install the latest version of nodejs.


- *cf 6.34.1*
The cloud foundry commmand line application. This tool will be used to install and manage the applications on the cloud foundry landscape. This tool can be downloaded from the cloud foundry website at https://docs.cloudfoundry.org/cf-cli/install-go-cli.html



# Setup

To begin, log into cloud foundry using the cf tool to verify that a connection can be obtained and the space can be accessed.

Remember too that with the trial accounts on SAP Cloud Platform, only two applications may running concurrently. In this project the full two applications will be utilized so if additional applications are already running in the space they will need to be stopped.

Open the *manifest.yml* file and note that there is a property in the env section called *BUSINESS_HUB_API_KEY* that needs to be filled in with the API key obtained from the api hub.

Also note that in order to allow multiple developers to run this project the names of the applications need to be changed so something unique so it is recommended that the developer change the name properties to something unique such as prefixing the names with their I/D/S/C/P number.

The sample manifest file should end up looking similar to

```yaml
applications:
- name: <I/D/S/C/P id>-concur-sfsf-services
  instances: 1
  memory: 128M
  disk_quota: 256M
  path: service
  buildpack: https://github.com/cloudfoundry/nodejs-buildpack
  stack: cflinuxfs2
  env:
    BUSINESS_HUB_API_KEY: <Your API Hub Key Here>

- name: <I/D/S/C/P id>-concur-sfsf-web
  instances: 1
  memory: 16M
  disk_quota: 16M
  path:      dashboard
  buildpack: https://github.com/cloudfoundry-community/staticfile-buildpack.git
```

The final change required is to ensure the UI application points to the correct service instance. Open the ExpensesModel.js file in the Dashboard/webapp/model folder and set the CLOUD_FOUNDRY_API_ENDPOINT to point to the service instance. This will be the application name for the service together with the URL for the apps landscape landscape

```
https://<I/D/S/C/P id>-concur-sfsf-services.cfapps.us10.hana.ondemand.com
``` 

*tip*
It is often easier to deploy the project and then open the project in the SAP Cloud Platform cockpit and obtain the service URL from there, rather than trying to work out the correct value by hand.

Once the above two changes have been implemented the application can be deployed to the cloud landscape. If the suggestion from the prerequisites have been followed then it is a simple matter to call

```
cf push
```

and this will push the two applications to the cloud foundry space and start them. Once the applications have deployed, open the brower and navigate to the service end point and add a "/webapp" to the path


The web application endpoint for the application will typically be in the form

```
https://<I/D/S/C/P id>-concur-sfsf-web.cfapps.us10.hana.ondemand.com
```

As before this can be obtained from the application details in the SAP Cloud Platform cloud cockpit for the space.

Navigate to the url in a browser to verify that the application has successfully deployed and is talking to the service

```
https://<I/D/S/C/P id>-concur-sfsf-web.cfapps.us10.hana.ondemand.com/webapp
```

To verify the service is functioning correctly the service can be called from a REST client such as postman or from the command line using  a tool such as curl which is shown below
Thanks to this [question](https://stackoverflow.com/questions/27238411/curl-output-to-display-in-the-readable-json-format-in-unix-shell-script) on Stackoverflow the resulting output can be formatted to be clearer using json_pp.

```
curl https://<I/D/S/C/P id>-concur-sfsf-services.cfapps.us10.hana.ondemand.com/status | json_pp
``` 

and the resulting response will be shown

```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    97  100    97    0     0    185      0 --:--:-- --:--:-- --:--:--   185
{
   "lastsync" : "2018-03-16T11:12:39.696Z",
   "uptime" : 24380655183000,
   "services" : "ok",
   "database" : "idle"
}
```
 
 This is sufficient to verify the service and the dashboard applications are functioning correctly.
 
 
# Service Implementation

The implementation of the service is the core to this project and is an integral part to understanding how to mashup API's from separate SAP properties through the SAP API Hub. Although we are using the SAP API Hub this could also easily be re-purposed to tak directly to the the actual servers as the API Hub provides the API's that are identical to the real API's provide in the relevant properties API's.

To learn more about the Concur API's access them at the Concur Developer Portal

[https://developer.concur.com/api-reference/](https://developer.concur.com/api-reference/)

To learn move about the SuccessFactors API's access them at the OData API Reference document

[SF_HCM_OData_API_REF_en.pdf](https://help.sap.com/doc/74597e67f54d4f448252bad4c2b601c9/1711/en-US/SF_HCM_OData_API_REF_en.pdf)


[Click here to access a more detailed deep dive into the implementation of the service](/pages/service-implementation.md)


# Dashboard Implementation

The implementation of the dashboard used to consume the service is based on the [Fiori Analytical List Page](https://experience.sap.com/fiori-design-web/analytical-list-page/). However due to the complexity of implementing this coupled with the large amount of required code and setup it was decided to create a lighter version that better illustrated the core concepts of what was to be shown.

The key files to examine the project are the Expenses model in the model folder and of course the Dashboard.xml and the Dashboard.controller.js files as these shpw how the model is integrated into the UI through binding. They also show a text book implementation of how to consume JSON data from a microservice within SAP UI5.

[Click here to access a more detailed deep dive into the implementation of the dashboard](/pages/dashboard-implementation.md)
   

Authors
-------

**Paul Todd**

+ https://github.com/paul-todd2


Copyright and License
---------------------

Copyright (c) 2013-2018 SAP SE

Except as provided below, this software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this software except in compliance with the License.You may obtain a copy of the License at:

[http://www.apache.org/licenses/LICENSE-2.0] (http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

