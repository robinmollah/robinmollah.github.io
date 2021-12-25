---
title: Uploading extra large files to S3
tags:
  - AWS
  - S3
date: 2021-12-26 01:52:14
---


In this article, I will be discussing 3 approaches we have followed to upload large files to S3.
As requirements increased, we had to face some issues in different methods we have faced and finally came out with the highest possible
performance in S3.
We have tried the following methods
- Streaming through multer-s3
- Single PUT Request
- Single POST Request
- Multipart Upload
<!--more-->

## [Multer-S3](https://www.npmjs.com/package/multer-s3)
This is the quickest way to implement the upload to S3. The file is streamed through an intermediary server provisioned by us.
Multer-S3 is a simple middleware that takes care of permission related stuffs and other managements required.

### Pros
- Fastest to implement

[[Insert image explaining the architecture]]
### Cons
#### Intermediary server bottlenecks bandwidth
Intermediary server needs to have a lot of upload and download speed. And eventually, the server is always a breaking point.
The upload speed can be severely affected when number of uploaders increase.
#### No considerable file size limit [for our requirements]
#### Cannot a resume an interrupted upload
Upload can be interrupted for network issues. It needs to be started from the beginning when using Multer-S3.

## PUT Request
We will need to generate a signed URL from S3 and then upload the file to S3. So, you will need to have a backend server that will 
contain a function to retrieve a signed URL to upload a file. You will be able to mention expiry time, content type and other for that URL.
In our case, we have deployed this function in AWS Lambda.

[[Insert image explaining the architecture]]
### Pros
#### No need to worry about the intermediary server
It directly uploads from browser to S3.

### Cons
#### Cannot resume a failed upload
If upload is failed due to network issues, we have to start from the beginning.
Also, network needs to be stable for the duration of the upload. As the file size is long, the time period is also very long.
#### File size limited to 2 GB
#### Browser gets stuck when uploading large files

## POST Request
The process of generating signed URL is more like the PUT Request. In a single POST request we can send upto 2 GB/5 GB file. 
Finally, we have used this method to upload the file to S3 in conjunction with multipart upload strategy.

## Multipart Upload
The multipart upload can utilize maximum bandwidth from client side by opening multiple connections to S3. The implementation is complexer than others.
You can check the [official link](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) for more details.
In this blog, I am going to discuss the implementation of multipart upload strategy in brief.

We had to make some changes in the backend. We had to start multipart upload. It gives us a UPLOAD_ID.
Instead of generating one pre-signed URL, we had to generate a pre-signed URL for each part of the file. 
Then we will need to send the pre-signed URL to the client. Each part will be uploaded using that link, directly to S3.
Finally, after all parts have been successfully uploaded, we will complete the multipart upload using the ETAGs of each part.

[[Insert image explaining the architecture]]

Known size related limitations of S3 Multipart Upload
https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html
### Pros
#### No need to worry about the intermediary server
#### No need to worry about the file size [upto * TB]
#### Resumable upload
If upload is interrupted due to network issues, we can resume the upload and upload specific.
#### Browser gets stuck when uploading large files
