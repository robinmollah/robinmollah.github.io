---
title: GCP Compute Engine | Creating Machine Images
tags:
- Cloud Computing
---
### Creating Machine Image from Existing VM

### Creating VM from existing Machine Image
##### create-machine-from-image.sh
``` bash
gcloud beta compute instances create vscode-image-3 \
--project=e3ds-master \
--zone=us-central1-a \
--machine-type=e2-medium \
--network-interface=network-tier=PREMIUM,subnet=default --metadata=^,@^windows-keys=\{\"expireOn\":\"2021-08-20T10:18:33.712Z\",\"userName\":\"eagle\",\"modulus\":\"yssBEdtIgib95TApWI195PA5Sdwxl\+T0ertp0m2kxWmQXVlKYh2Q0L9DYOpbEBpA0EZk\+t1EbdsJwN71nbOqGtjS60\+332ge8KIfI6OGVa86dRHZdboy0LqF5aZZM03Pcg9K\+5GVsdIcgMivzzmBFiOkYlkJ\+shZIyV/EspVYSi1P23r5z2JWauRoLFF7HYTvKPQOj5plVo/pCU7W2XT8DPXPCRHyYgFj0x/bvBcOkTEcmyL3XfX33YU/zAAmU3JxXfIxkWj5tN\+NvNnWIs\+ELQCNSIvnWgoTXlhnVTe6\+rzUxTVhUzlsSLpUK1lL/sTChRDnWutw2KC0eJlxsXC2Q\\u003d\\u003d\",\"email\":\"robin@eagle3dstreaming.com\",\"exponent\":\"AQAB\"\}$'\n'\{\"expireOn\":\"2021-08-20T10:19:45.062Z\",\"userName\":\"robin\",\"modulus\":\"kifbfgRbt8EnytfQ3KySwu9PkilB86vj0DJy3p6Ci1WEsmrFZDaYeP1HkECN3xenuiHdevBGaG0/RT3U4Uz2L1XQQOIRpctfjICgLRWpEO7ERUbOEqGcTcS5tEdDUcK8O1iq0LoNDG0W9lZBiflItP7EA2eFEuoeVQUO2dFOgp6L95pL9\+BB/CJxskPm0TWNRG4wkrXGdRSTRfZAwHAeWS/FP447Hr8va8DMKGdOiIg6mx7wKCgpPLQHzoW/3CJ2uhBac8PCgiJDL2x4ffxmux3yB7jNWDOaW5oMw43lLJesiu\+9m0Ofz\+PlpmhbjDyyDZC49NmW2KjetdfbmTpDIw\\u003d\\u003d\",\"email\":\"robin@eagle3dstreaming.com\",\"exponent\":\"AQAB\"\},@ssh-keys=robinmollah:ssh-rsa\ AAAAB3NzaC1yc2EAAAADAQABAAABgQDW2oWGTREhjY8ENWkl8JxCc/mp1MhT0lccaESazElWMEb\+Jtmz\+PFh\+HXbwupxZSfRVR4WnrOOtGIB7CqohIseOQKfQrqG0cAau04Clq2OI8ZTqAHWPrj9bEIcspqu6RZO/JskpAdS8pvd9jDYzQ/6xIwIAMcm1HH6pOHBWejmlUCSiGJPFZtZan7WtbI8Eb9yDoU3\+S\+OVQLMbxtcNrHnYvkG4W0w9VsmBFdw\+Md7hITDPCwUZyDESIIGEAIbZszMk/MN33IUbgLM\+MREVeum1EiugVg2FnXXIT\+EjNECB/HhZOI9JVcirKGT1MvZx189f5Q0ulRHWkMizxx9r2vVu/UK81Zd8N7O/qFTTuQiihAKjP5M9xLXnRVH0cKigOjcbo021zBuLWQRI0kDLMhL/2li2d76NoUnC6Gz6DL\+DcC7ewOq8y3hh2am8c8OtrpRyCPVJINe96x30qDsGPckTkz/UI0/W\+hFKXxa1jyCKNIOTZM/XqA1276ZmlXjCnk=\ robinmollah@robinmollahmac.local \
--maintenance-policy=MIGRATE \
--service-account=642640802991-compute@developer.gserviceaccount.com \
--scopes=https://www.googleapis.com/auth/cloud-platform \
--min-cpu-platform=Automatic \
--enable-display-device \
--tags=http-server,https-server \
--no-shielded-secure-boot \
--shielded-vtpm \
--shielded-integrity-monitoring \
--reservation-affinity=any \
--source-machine-image=projects/e3ds-master/global/machineImages/vscode-image
```
