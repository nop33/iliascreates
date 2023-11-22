---
title: "Registering multiple schemes in an Expo app"
date: "2023-11-22T11:19:00.000Z"
description: ""
---

I have register a custom scheme for my Expo app so that I can deep link to it from the browser:

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

However, I want to register multiple schemes without ejecting, meaning that I want to manage my app config through the Expo app.config.js file. Reading the [docs of the `scheme` property](https://docs.expo.dev/versions/latest/config/app/#scheme) it looks like it only accepts a `string`. Searching the web did not result in any better ideas, the only related SO question I could find was this one: https://stackoverflow.com/questions/56164960/how-to-add-multiple-url-schemes-in-expo-app-without-ejecting

After diving deeper [into the source files](https://raw.githubusercontent.com/expo/expo/main/docs/public/static/schemas/unversioned/app-config-schema.json) of the Expo docs I noticed that the documentation website has a bug. The actual accepted value for the `scheme` property is this:

```json
{
  "oneOf": [
    {
      "type": "string",
      "pattern": "^[a-z][a-z0-9+.-]*$"
    },
    {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-z][a-z0-9+.-]*$"
      }
    }
  ]
}
```

I tried to see if I can quickly submit a fix but it seems a bit more complicated, so I just submitted an issue: https://github.com/expo/expo/issues/25516

## Solution

Setting an array instead of just a string actually worked!

```json
{
  "expo": {
    "scheme": ["myapp1", "myapp2"]
  }
}
```
