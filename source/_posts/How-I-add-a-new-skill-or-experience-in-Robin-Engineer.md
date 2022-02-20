---
title: How I add a new skill or experience in Robin.Engineer
date: 2022-02-20 16:29:30
tags:
- Pug
- JavaScript
- HTML
- IntelliJ IDEA
---

This is a very simple question. Isn't it? I just open the HTML file and I add a new skill or experience. But I don't do it in this way.
How do I update it in my portfolio website? Before going into that question, let me tell you how I am doing this thing and why? Let's explore the options we have.
Do I store the skills map in a database? Keep it hard coded in the HTML file? How simple I want?
<!--more-->
### Do I store the skills map in a database?
I don't want to keep a table in database to keep just a small array that is not getting updated mostly.
Besides, if I keep them in database, I will need to involve server side code + retrieve this almost static data from the database.
So, it will take some time to appear in the website.

Then what is the another way to do it?

### Keep it hard coded in the HTML file?
If I do this, then I will need to go to that HTML file, find the lines and add it their. And the tree of expertise is pretty complex. So, there is a possibility that I will break something.

### How simple I want?
I want to have a JSON file. That will update it. So, how I can update the static HTML file by a JSON file?
Pug is a template engine which can do this.

Now, how I can use pug? The example given in the documentation is inspiring to use express as a backend. But I don't want any server side code. Pug has a CLI.

Now, issue is, everytime I make an update in the JSON file, I need to run the cli command and refresh the browser to make that visible. How do I not do this? And make it automated?

The trick is file watcher. IntelliJ IDEA itself provides an option to do this. You can learn more in the following link.

It also gives me another benefit, I can write in PUG, make use of loops, layouts, etc. Then I can add the pug in GitHub actions or other build tools.
I would like to note that EJS has the similar benefits + its syntax is very similar to the raw HTML.

## Summary
I keep a JSON file named `skills.json`. I just update this file. When this file is updated, file watcher automatically updates the HTML file. When I push to the github repository, I just push the PUG files and the JSON files.
Github actions builds the HTML, CSS, and compressed uglify JS file using `uglifyjs` and push them to the server. This server might be Firebase hosting, A linux machine backed by nginx, A cloudfront distribution, a GCS bucket etc.



IDE: IntelliJ IDEA
Front-end: PUG, SASS, CSS3, HTML5
Backend: Node.js, Express.js, MongoDB
