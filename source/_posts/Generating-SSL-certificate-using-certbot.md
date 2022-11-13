---
title: Generating SSL certificate using Certbot and Lets Encrypt
date: 2022-11-13 05:45:08
tags:
    - SSL
---

Lets Encrypt allows to generate a free SSL certificate for almost anyone who owns a domain. Generating an SSL certificate
is very easy when you are behind a NGINX server or the IP Address is directly pointing to the server you are IN.
It gets a bit tricky in other cases. You have to use the certbot's DNS challenge verifying ownership of the domain. Here
are the steps:

<!--more-->

### Install certbot
```
sudo apt-add-repository ppa:certbot/certbot
sudo apt install certbot
```

### Requesting a certificate
Here I am requesting an wildcard SSL certificate for `*.robin.engineer`. You can try using your domain.
```
sudo certbot certonly --manual --preferred-challenges dns -d *.robin.engineer
```

You will see an output like the following:
```
Requesting a certificate for *.robin.engineer

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please deploy a DNS TXT record under the name:

_acme-challenge.robin.engineer.

with the following value:

YFIQf3EDS1PG17pJ3hGiAS3xEtwr4CSA2noBbFYe2Yc

Before continuing, verify the TXT record has been deployed. Depending on the DNS
provider, this may take some time, from a few seconds to multiple minutes. You can
check if it has finished deploying with aid of online tools, such as the Google
Admin Toolbox: https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.robin.engineer.
Look for one or more bolded line(s) below the line ';ANSWER'. It should show the
value(s) you've just added.
```

### Automation of adding DNS record
In my case, I needed to add DNS record to the Azure platform. To add DNS record, you can run the following command:

```
az network dns record-set txt add-record --resource-group myresourcegroup --zone-name robin.engineer --record-set-name _acme-challenge.robin.engineer. --value "YFIQf3EDS1PG17pJ3hGiAS3xEtwr4CSA2noBbFYe2Yc"
```
