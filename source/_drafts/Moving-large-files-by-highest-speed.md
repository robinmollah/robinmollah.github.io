---
title: Moving extra large files by highest speed
date: 2021-08-20 20:24:37
tags:
---

We were dealing with a scenario that requires to move 25-100 GB of a single zip file to some short-lived instances that 
starts and terminated randomly. The life span of machines could be 4 minutes to 1 hour. Our requirement is moving the files
to the instance within 5 seconds.
