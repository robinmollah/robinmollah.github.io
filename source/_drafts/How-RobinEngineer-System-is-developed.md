---
title: How RobinEngineer Systems are designed and developed
tags:
  - Software Architecture
  - Continuous Integration
  - Continuous Delivery
  - Software Design
---

Suppose, I have published a new blog in this website. How it's immediately available in my GitHub profile? How my last 
3 blogs are available in the portfolio website? And, I have implemented a lot of features for ease of maintenance of my 
portfolio, GitHub Profile, blogs and other separate services using different strategies. In this article, I will talk about 
this architecture.

<!--more-->

Robin's Blog
--------------------

I am talking about [this](https://blog.robin.engineer) blog. It is developed using Hexo, and it is deployed in GitHub Pages.
So, I am paying nothing for this server. 
### Markdown language
I choose Hexo because it provides Markdown language. So I can write in my IDE.
Sometimes, I write blocks of lines in Trello, Telegram and some other applications. They have similar Markdown language.
So it is easy for me to copy and paste to/from some other places. My other helping friends don't need to learn almost anything new.

### No serverside language
It generates plain HTML file using themes and plugins. I can just serve the HTML files using NGINX. I can put it anywhere.

# Robin's Portfolio website
Initially, it was deployed in Google App Engine. So, I didn't pay anything for this website as well. Because, AppEngine 
has an always free tier available that is enough for this server.

# GitHub Main Profile
This profile is visible when someone visits my [GitHub](https://github.com/robinmollah) profile. GitHub introduced this feature not more than a year ago.
A repository under same as username and Markdown file could be made visible in the GitHub profile.

## How all these are interacting

When I publish a blog in the **Blog Website**, a Action runs to publish to GitHub pages. The same action also notifies 
about the last posts to the portfolio website and downloads and runs a program to edit my GitHub Profile.
