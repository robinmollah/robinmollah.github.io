---
title: Manage Linux users
date: 2024-09-22 13:45:39
tags:
  - GKE
  - Kubernetes
  - SSL
  - Ingress
---


# Create a new user

## Add a new user

```shell
sudo adduser robin
```

## Create user and home directory

```shell
sudo useradd -m -s /bin/bash robin
```

Here, the `-m` flag creates the home directory for the user.

Interesting fact: If there is no home directory created for the user, the user can't login using the GUI.


## Add user to sudo group

```shell
sudo usermod -aG sudo robin
```

Note: If the user is not added to the sudo-er list, user cannot run the `sudo` commands.

## Change user password

```shell
sudo passwd robin
```

## Delete a user

```shell
sudo deluser robin
```

## Delete a user with home directory

```shell
sudo deluser --remove-home robin
```

## Change user name

```shell
sudo usermod -l newname oldname
```

## Change user home directory

```shell
sudo usermod -d /new/home/dir -m username
```

## Change user shell

```shell
sudo usermod -s /bin/bash robin
```

