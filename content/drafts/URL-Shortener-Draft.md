---
title: URL Shortener Draft
tags: software-architecture
---

I have given this example to how I make a draft plan to begin development.
In different projects, I take different approach.

### Requirements
1. User will be able to create a short link of a long URL.
2. Ability to see the analytics of links
3. Update destination URL of the links
4. In this document, I have skipped scalability and other requirements that is applicable to put it in the production 
   for mass use. It is just for learning purpose.

<!--more-->
## Milestones
### Backend
#### 1. User will post a long link and get a short link
root/links/[short_link, long_link]

#### 2. Browse a short_link and get a redirection to rule to long_link
From NodeJS Express server 302 HTTP redirection

#### 3. Log each entry to Firebase
root/links/[short_link, long_link, analytics{timestamp, ip, geo-location}]

#### 4. Add login feature
Amazon Cognito/Firebase Auth

### Frontend
#### 1. A text input field and a submit button
#### 2. A login option
