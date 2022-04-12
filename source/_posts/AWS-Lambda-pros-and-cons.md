---
title: What you need to know about AWS Lambda before using it.
date: 2021-08-25 17:11:46
tags:
  - AWS
  - Cloud Computing
  - Lambda
  - Cloud Functions
---

Lambda is a Function-as-a-Service program of AWS. It has a lot of awesome features. We deployed some of our API's that was 
written in NodeJS to Lambda. In this article, I will share my experience of migrating frm Express also I will go through
the benefits and disadvantages of Lambda. Please note that, this article is not about introduction to Lambda rather than a review on it.


## Migrating from Express to Lambda

There are several ways you can migrate from Express to Lambda. The fastest way is using **aws serverless express** node module.
But using this method **creates some difficulties to manage API Gateway tool**. When using Express in Lambda, API Gateway tool
lose the ability to manage individuals routes. It redirects all requests to Express.
API Gateway tools provides a lot of benefits for managing routes including Authorization, staging, documentation, and easy 
to add, delete or rename the routes by button clicks.

<!--more-->


Another approach is, practically breaking down the project into several parts. It is a time-consuming process if you have never
thought about it at the beginning of development. In most cases, every route will produce a new function.  

## Benefits of Lambda
### Nice collaboration with other AWS Services
I have used API Gateway and EventBridge with Lambda. But, Lambda function can be triggered from a large ranging sources
like SNS, SQS, S3 Events, DynamoDB, Apache Kafka, Several IoT and third party triggers. It also enables to add destinations to 
another Lambda(chaining), SNS Topic, SQS Queue or EventBridge.

### Fine grip on the execution and security
Lambda gives wide range of control over the API including authentication, execution environment and security. As, you can assign specific IAM 
permissions to each function, you can also add a custom policy to the function. Usually, when running in the server, 
the whole server is using a single API KEY of same IAM account. Also, Lambda offers several ways for authentication of API Gateways.

### Team collaboration
Lambda can be written in several languages and separately. Suppose, I love working with NodeJS. But, I want to have a simple function from my 
friend who only works with Python or Java. He can write a Python function, and it works smoothly with other NodeJS applications.

## Disadvantages
### Debugging
When other AWS Services are used in Lambda functions, there are some difficulties to debug. Lambda functions need to be provided some
roles and permissions. In local environment, usually permissions are Admin level. The easies way to debug Lambda function is to write a test
JSON file and run it using that JSON file. Now, creating and managing those test cases becomes another task. Then, when we are using 
the Lambda function behind a API Gateway, we need to write a test case for each API. So, getting a properly unit tested environment requires
a good amount of management. It is possible to run the function in local docker environment, but that doesn't take into account 
the permissions of the function and it also takes a lot of time to run.

### Management of functions
When your project grows, and the number of functions increases, it is very hard to maintain many functions separately. So, in this stage, 
you can think about merging some functions together, because there is no option to make folders. But, you can make put as many Javascript function 
you want then write some internal codes to execute them depending on the type of trigger. API Gateway has a nice looking 
view to do that.

### Version Control System
It is quite hard to manage Version Controls of Lambda. If your functions are small then a repository is a too large subject to maintain them.
Even, if you maintain a version control system, it doesn't really help to move it to another AWS Account for easy deployment.
Because still you will need to go to the AWS Console to do other stuffs.

To tackle this scenario, I have written another blog on `CloudFormation`.
For better decision-making you can see the differences between CloudFormation and Terraform in [this blog](https://cloudonaut.io/cloudformation-vs-terraform/).
