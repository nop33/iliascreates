---
title: "How to combine p12 certificate files"
date: "2023-11-22T17:43:00.000Z"
description: ""
---

If you have 2 .p12 files (say `certificates_1.p12` and `certificates_2.p12` ), each encrypted with its own password, you can merge `certificates_1.p12` into `certificates_2.p12` with the following command:

```shell
keytool -importkeystore -srckeystore certificates_1.p12 -srcstoretype PKCS12 -destkeystore certificates_2.p12 -deststoretype PKCS12
```

This was the case when we wanted to update the certificates we use to code-sign our macOS app and we needed to combine the old certificates with the new ones so that the automatic update system would work.
