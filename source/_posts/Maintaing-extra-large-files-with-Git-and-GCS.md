---
title: Maintaining extra large binary files with Git and GCS
date: 2022-07-22 16:29:21
tags:
    - Version Control
    - Git
    - DevOps
    - GCS
    - Extra Large files
---

##### [Writing in progress]
### Index
- Overview
- Limits of existing git servers
- Gitea
- Method of integration with GCS


Git is not good for version controlling large binary files. Especially if they are frequently making a huge historical changes.
The repository size increases rapidly. It exponentially increases the time to clone the repository to a new machine or instance.

There is a maximum file and repository limits in Git systems as well.

Besides, we don't get a lot of benefits of Git for binary files. For example, we can't merge the changes from different branches.
We cannot have a meaningful history of the changes.

### In this article I will be discussing the size issues and their solutions only.
In this table, I am showing the comparison between some popular Git systems and their maximum allowed size.

| x       | GitHub | BitBucket | GitLab |
|---------|--------|-----------|--------|
|Single file limit| normally: **100 MB**<br>With LFS: **2GB** | 
| Repository size | Recommended: <**1GB**<br>Strongly recommended: <**5GB** | normally: **2 GB**<br>With LFS and paid upto **4GB** |
<!--more-->
However, one solution could be deploying your own git server. It is very easy to deploy your own git server, without the above 
limits using [Gitea](https://gitea.io/). You will still need to use Git LFS for extra large files and the issue of cloning and maintaining
is still there.

So, experiencing all above methods, I have found we can integrate GitHub with GCS and a bit of scripting to make it work seamlessly.

### How it works?
In brief, binary files are ignored from the Git system. But while committing a change and tagged with `bin-updated`, it get uploaded in a GCS bucket.

Prerequisite knowledge:
* Bash scripting
* [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) : Used to run script before and after a commit.
* gcloud : Used to authenticate to gcloud.
* gsutil : Upload file to GCS.

### Setting up GCS
- Login to GCS
`gcloud auth login`
- [Create a bucket](https://cloud.google.com/storage/docs/creating-buckets#storage-create-bucket-cli)
`gsutil mb gs://BUCKET_NAME`
- [Upload to GCS](https://cloud.google.com/storage/docs/uploading-objects#gsutil)
`gsutil cp <file_path> gs://<bucket_name>/<file_name>`
- [Download from GCS](https://cloud.google.com/storage/docs/downloading-objects#gsutil)
`gsutil cp gs://<bucket_name>/<file_name> <file_path>`

### Scripting Git Hooks

#### On client side:
**[pre-push hook](https://stackoverflow.com/questions/4196148/git-pre-push-hooks):**
The script uploads the file to GCS and leaves a text file in that files location with extension `.cloud` containing the gcs path of the file.

#### On server side:
**[post-receive hook](https://stackoverflow.com/questions/28106011/understanding-git-hook-post-receive-hook):**
The script finds all files with `.cloud` extension and downloads from the gcs bucket in that folder.

#### Reference
- [GitHub limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)
- [BitBucket limits](https://support.atlassian.com/bitbucket-cloud/docs/reduce-repository-size/)
