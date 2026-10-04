---
title: Optimising disk usage of a linux server
date: 2022-12-15 19:33:26
tags:
    - Linux
    - Optimisation
    - Bash
    - Server
---

Finding out which files, folders or tools are consuming disk size might be tricky. In this article, I am going to discuss some 
basic commands and tools those are helpful for finding out the issues and some measures that can prevent unnecessary disk usage.
### Get started
The following command prints the folders with disk usage greater than a Gigabyte.
```
du -h / 2>/dev/null | grep '[0-9\,]\+G\s'
```
#### Explanation
`du /` lists all the folders and their disk usage
`-h` flag prints the sizes in human-readable format
`|` pipe operator
`grep '[0-9\,]\+G\s'` runs a regular expression pattern in each line. The pattern means anyword that starts with at least one digit followed by a comma, then followed by a letter `G`
`2>/dev/null` (This phrase suppresses all errors.) In this case, filters out all the "permission denied" error.

#### Sample output:
```shell
2.1G	/usr/lib
3.6G	/usr
1.1G	/var/log/journal/15fbb9d7d55f2ef0bcfb758634f17574
1.1G	/var/log/journal
1.1G	/var/log
2.0G	/var
1.2G	/home/robinmollah/.cache/yarn/v6
1.2G	/home/robinmollah/.cache/yarn
1.2G	/home/robinmollah/.cache
3.4G	/home/robinmollah
3.6G	/home
9.3G	/
```
<!--more-->

There are some repetition of same folder. So, we can use `--max-depth=2` to suppress some of them.

Sample output:
```shell
2.1G	/usr/lib
3.6G	/usr
1.1G	/var/log
2.0G	/var
3.4G	/home/robinmollah
3.6G	/home
```

From the above two outputs, we can see two interesting points of disk consumption. One is yarn cache and another is var/log/journal.

## Configuring journal for storage optimisation
```shell
sudo bash -c 'echo "SystemMaxUse=100M" >> /etc/systemd/journald.conf'
sudo systemctl restart systemd-journald
```
You can execute the above commands to limit the journal size to 100MB. For more detailed configuration, you can edit /etc/systemd/journald/conf file.
Here is the content of that file, you may uncomment and edit any variable that suits you.
```shell
[Journal]
#Storage=auto
#Compress=yes
#Seal=yes
#SplitMode=uid
#SyncIntervalSec=5m
#RateLimitIntervalSec=30s
#RateLimitBurst=10000
#SystemMaxUse=
#SystemKeepFree=
#SystemMaxFileSize=
#SystemMaxFiles=100
#RuntimeMaxUse=
#RuntimeKeepFree=
#RuntimeMaxFileSize=
#RuntimeMaxFiles=100
#MaxRetentionSec=
#MaxFileSec=1month
#ForwardToSyslog=yes
#ForwardToKMsg=no
#ForwardToConsole=no
#ForwardToWall=yes
#TTYPath=/dev/console
#MaxLevelStore=debug
#MaxLevelSyslog=debug
#MaxLevelKMsg=notice
#MaxLevelConsole=info
#MaxLevelWall=emerg
#LineMax=48K
#ReadKMsg=yes
#Audit=no
```

## Configuring logrotate files
In the `/etc/logrotate.d` folder, some configuration files can be found. In our case, we have 2 relevant files. One is nginx.
Nginx stores all access logs and error logs that becomes large gradually. All files starts with the name(s) of the log file,
where it is storing the logs. After one file, it compresses the old files into gzip format. Here is the default nginx log config file.

```shell
/var/log/nginx/*.log {
	daily
	missingok
	rotate 14
	compress
	delaycompress
	notifempty
	create 0640 www-data adm
	sharedscripts
	prerotate
		if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
			run-parts /etc/logrotate.d/httpd-prerotate; \
		fi \
	endscript
	postrotate
		invoke-rc.d nginx rotate >/dev/null 2>&1
	endscript
}
```

Here `/var/log/nginx/*.log` is the name of the log file. So, to determine the disk consumed by that you can run:

```shell
ls /var/log/nginx/*.log -lh
```
Output:
```shell
-rw-r----- 1 www-data adm 29K Dec 15 14:05 /var/log/nginx/access.log
-rw-r----- 1 www-data adm 45K Dec 15 14:05 /var/log/nginx/error.log
```
Here, I see access.log file size is 29K and error.log size is 45K. You may see some .tar.gz files those are compressed old logs.


You can limit the number of files to store in the value of `rotate 14` to `rotate 1` so that it keeps only one file.
From the above script you may wish to run any prerotate and postrotate script for more advanced clean up.
You may have mariadb, rabbitmq server log configs in this folder.

