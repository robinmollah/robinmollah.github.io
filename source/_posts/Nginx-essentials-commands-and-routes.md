---
title: Nginx essential cheatsheet
date: 2022-12-06 00:45:09
tags:
    - nginx
    - cheatsheet
---

Nginx saves it's logs, configs, binaries in different folder in different operating system. Every time I struggle to find them in different locations.
Also, the commands are different. I have curated these in this document based on Ubuntu, Macbook and CentOS(coming soon).
Moreover, there are some frequently encountered issues and solution.
<!--more-->
### Root config file location
Mac: `/usr/local/etc/nginx/nginx.conf`<br>
Ubuntu: `/etc/nginx/nginx.conf`
### Log file location
You may need to uncomment a line in the config file to actually get error dump in the file. You may wish to keep it clean periodically.

Mac: `/usr/local/Cellar/nginx/1.23.2/logs/error.log`<br>
Ubuntu: `access_log /var/log/nginx/access.log`
`error_log /var/log/nginx/error.log`
### Commands
#### Test config files
Mac: `sudo nginx -t`
#### Reload config files
Mac: `sudo nginx -s reload`<br>
Linux: `sudo systemctl reload nginx`<br>
`sudo service nginx reload`
#### Stop nginx
Mac: `sudo nginx -s stop`
Ubuntu: `sudo systemctl start nginx`
#### Start nginx
Mac: `sudo nginx`<br>
Linux: `sudo systemctl start nginx`
#### Restart nginx
Linux: `sudo systemctl restart nginx`<br>
`sudo /etc/init.d/nginx restart`

### Troubleshooting
#### upstream sent too big header while reading response header from upstream
It occurs in a reverse proxy block. To fix this issue, find the reverse proxy block and add the following statements.

```
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_busy_buffers_size 512k;
    proxy_buffers 4 512k;
    proxy_buffer_size 256k;
}
```

#### Rewrite based on a part of URL
I actually don't try to use the `rewrite` statement until it's really necessary. Here are some examples, that can be achieved using `rewrite` and regex based location block both.

```
location ~ /server1/(.*)$ {
    proxy_pass http://127.0.0.1:3050/$1;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400s;
}

location ~ /server2/(.*)$ {
    proxy_pass http://127.0.0.1:3052/$1;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400s;
}
```
#### Rewrite
```shell
rewrite regex URL [flag];
```
Using `rewrite` URL(not tested),

```shell
location /server1/ {
    rewrite ^/server1/(.*)$ /$1 last;
    proxy_pass http://127.0.0.1:3050/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400s;
}

location /server2/ {
    rewrite ^/server2/(.*)$ /$1 last;
    proxy_pass http://127.0.0.1:3052/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400s;
}
```
Above blocks can be merged, will update it later.

Above config sends `http://example.com/server1/robin` request to a service running in the 3050 port, like `LOCALHOST:3050/robin`.
Also, sends `http://example.com/server2/robin` request to a service running in the 3052 port, like `LOCALHOST:3052/robin`.
Note: It's not redirection.
