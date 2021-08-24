---
title: What you need to know about AWS Lambda before using it.
tags:
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
It takes a good amount of effort to make an API secure. Lambda gives wide range of control over the API including execution environment, time, authentication etc.

### Team collaboration
Lambda can be written in several languages and separately. So, a team with several distinct skill set 

## Disadvantages
### Debugging
I have to create a test event JSON in the Lambda's console. Then I have to create another JSON to test in the API Gateway.
There are cases where Lambda function doesn't 

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
