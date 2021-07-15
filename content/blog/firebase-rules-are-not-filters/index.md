---
title: 'Rules are not filters: Fixing Firebase "Missing or insufficient permissions" error'
date: "2020-10-15T13:47:00.000Z"
description: "Pay attention that the queries you build are taking into account your security rules. Firebase will return an error in case you are querying for resources that the authenticated user has no access to."
---

While experimenting with [Firebase](https://firebase.google.com/) and specifically [Cloud Firestore](https://firebase.google.com/docs/firestore) I reached the point where I had to control who can read and write data to my collections. Since the application I am building is a client-side application only, the Firebase way to restrict access to it is through [Firebase Authentication](https://firebase.google.com/products/auth) and [Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started).

For the purposes of this blog post, let's assume that I have 1 main collection called `flats` which includes a subcollection called `items`.

After reading through the documentation, testing some rules, updating my collections structure, I ended up with the following rules:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /flats/{flatId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null
                                  && request.auth.uid in resource.data.idsOfUsersWithAccess;

      match /items/{itemId} {
        allow create: if request.auth != null;
        allow read, update, delete: if request.auth != null
                                    && request.auth.uid in resource.data.idsOfFlatmatesThatShareThis;
      }
    }
  }
}
```

What the above rules basically say is that any authenticated user (`request.auth != null`) is `allow`ed to `create` a flat, but they are only `allow`ed to `read`, `update` or `delete` a flat if their unique ID (`request.auth.uid`) is included in the flat's property called `idsOfUsersWithAccess`.

Now, since the `items` collection is a subcollection of the `flats` one, I created a nested rule which extends the previous one (read more about [rules for hierarchical data in the docs](https://firebase.google.com/docs/firestore/security/rules-structure#hierarchical_data)). The rule says that only authenticated users are `allow`ed to `create` items but in order to `read`, `update` or `delete` an item the user's unique ID needs to be included in the `idsOfFlatmatesThatShareThis` property of the flat.

For some reason however I could not fetch the items of the flat in my app and I was getting the following error:

```
Uncaught (in promise) FirebaseError: Missing or insufficient permissions.
```

After quite a bit of digging into my code and the Firebase docs I found the problem. My code to fetch the items of a flat is the following:

```js
firestore.collection("flats").doc(flat.id).collection("items").get();
```

My simple brain (I like to call him _Brian_) had this thought:

> If the authenticated user queries all flat items, the result will surely only include the ones they have access too, based on the security rules that I created.

WRONG.

The [documentation on writing conditions for Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules-conditions) clearly says:

> Rules are not filters. You cannot write a query for all the documents in a collection and expect Cloud Firestore to return only the documents that the current client has permission to access.

Oopsie!

The problem was not in my rules. It was in my query. Adding a `where` clause to match the rule fixed the problem and I could now load the intented items:

```js
firestore
  .collection("flats")
  .doc(flat.id)
  .collection("items")
  .where("idsOfFlatmatesThatShareThis", "array-contains", state.user.id)
  .get();
```

## What did I learn?

To spend a bit more time reading the docs before diving into coding! Or at least skimming through all of them quickly ;)

PS: I would totally recommend the video series of [Get to know Cloud Firestore](https://www.youtube.com/playlist?list=PLl-K7zZEsYLluG5MCVEzXAQ7ACZBCuZgZ) on Youtube.
