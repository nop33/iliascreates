---
title: "Using Ansible unarchive with Alpine Linux"
date: "2020-12-10T17:46:00.000Z"
description: "Solving the error message \"[Errno 2] No such file or directory: b'-T'\""
---

If you are running [Ansible](https://www.ansible.com/) on [Alpine Linux](https://alpinelinux.org/) and you use the [`unarchive` builtin module](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/unarchive_module.html) you might have faced the following error message:

```
[Errno 2] No such file or directory: b'-T'
```

The reason for this is that the `unzip` tool in Alpine does not have a `-T` option. To be able to use the `unarchive` Ansible module with Alpine Linux, you need to install `unzip`:

```console
apk add unzip
```

See the [related GitHub issue](https://github.com/ansible/ansible/issues/39029).
