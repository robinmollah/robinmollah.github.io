---
title: URL Shortener
tags: software-architecture
---


### Requirements
1. User will be able to create a short link of a long URL.
2. Ability to see the analytics of links
3. Update destination URL of the links

<!--more-->
## Milestones
### Backend
#### 1. User will post a long link and get a short link
root/links/[short_link, long_link]

#### 2. Browse a short_link and get a redirection to rule to long_link
From NodeJS Express server 302 HTTP redirection

#### 3. Log each entry to DynamoDB
root/links/[short_link, long_link, analytics{timestamp, ip, geo-location}]

#### 4. Add login feature
Amazon Cognito/Firebase Auth

### Frontend
#### 1. A text input field and a submit button
#### 2. A login option
