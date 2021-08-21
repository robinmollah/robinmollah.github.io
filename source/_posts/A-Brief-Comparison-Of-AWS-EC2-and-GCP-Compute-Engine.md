---
title: A Brief Comparison of AWS EC2 and GCP Compute Engine
tags: 
  - Cloud Computing
  - Compute Engine
  - EC2
  - AWS
  - GCP
  - Comparison
categories:
  - Cloud computing
---

In this article, I will show a comparison of workflow of Compute Engine and EC2 instances, and the features they offer. I will also show how each of their features created or solved our issues or made our management easier.
<!--more-->
## Creation
### AWS
After logging in, you have to go to the region where you want to create a machine. Then, after clicking "Launch instances", you will be prompted by 5-6 tabbed page to fill up a long form to select instance type, pieces of hardware, networking, security groups and so on. It is very customizable at the cost of lengthy form. I would suggest creating a script to do these tasks.
### GCP
In GCP, it gives you a short form, and it contains the same thing necessary for 95% of the developers. The word choices are very easy to understand for entry level developers.
For example, In GCP, there is a checkbox to allow or reject HTTP or HTTPS. In AWS, you have to block port 80 and 443 from the *Networking* section. Unlike AWS, an equivalent command to do the same things is also generated for you.



## Remoting
### In AWS
#### SSH

#### RDP
In the connect page, a downloadable RDP file and RDP credentials both are shown. You can open RDP Client and input them manually, or you can download the file and open that file.
In AWS, you get an 
