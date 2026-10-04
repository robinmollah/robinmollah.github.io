---
title: Deploying third party SSL in the GKE
date: 2022-11-08 13:45:39
tags:
    - GKE
    - Kubernetes
    - SSL
    - Ingress
---

## Prerequisite
You already have the fullchain and private key of the SSL certificate. How to use them to access a deployment.

### Kubernetes resources
We will need the following resources:
- A deployment (WebServer) **[Pre-requisite]**
- A NodePort pointing to the deployment
- An Ingress pointing to the NodePort
- An SSL certificate [You can get free from nginx as well]


<!--more-->


#### Upload SSL Certificate as secret
Example of HAML:<br>
ssl.yml
```yaml
apiVersion: v1
data:
  tls.crt: {{fullchain.pem_content_base64_encoded}}
  tls.key: {{privkey.pem_content_base64_encoded}}
kind: Secret
metadata:
  name: secret_name_for_ssl
  namespace: default
type: kubernetes.io/tls
```

In the `tls.crt` and `tls.key` value, put base64 encoded string of fullchain.pem and privkey.pem files contents.

Run `kubectl apply -f ssl.yml`
**Do not add this file in the git, as it contains sensitive certificate credentials.**

#### NodePort Service -> Deployment

Example HAML:
nodeport.yml
```yaml
apiVersion: "v1"
kind: "Service"
metadata:
  name: "nodeport_service_name"
  namespace: "default"
  labels:
    app: "deployment_name"
spec:
  ports:
    - protocol: "TCP"
      port: 80
      targetPort: 80
  selector:
    app: "deployment_name"
  type: "NodePort"
```

Run `kubectl apply -f nodeport.yml`

#### Ingress -> NodePort Service

Example HAML:
ingress.yml
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: "ingress_name"
spec:
  tls:
    - secretName: secret_name_for_ssl
  defaultBackend:
    service:
      name: nodeport_service_name
      port:
        number: 80
```
Run `kubectl apply -f ingress.yml`


#### Known issues
It takes some time to get the SSL certificate available to the ingress.
