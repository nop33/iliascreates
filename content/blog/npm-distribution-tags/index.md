---
title: "Using npm distribution tags the right way"
date: "2022-04-02T15:06:00.000Z"
description: "How to properly make use of npm distribution tags when publishing on npm and not be a goofy like me."
---

I learnt a lot about npm package distribution tags at work in the past couple of weeks and I thought to share my learnings in this blog post.

Publishing a package on npm is quite simple. All you need is an account on npmjs.com and a project containing a `package.json` file. Then, with a few simple commands you can publish your package to npm:

```shell
npm login
npm publish
```

The above command will pack your project and deploy it to the npm registry. What's more, is that it will make the `latest` distribution tag of your npm package point to the version of the package that is defined in the `package.json` file:

```js
// Example package.json file
{
  "version": "0.1.0"
}
```

> But what is a [distribution tag][dist-tag]?

What this means is that when a user of your package installs it with `npm i my-awesome-package` or `npm i my-awesome-package@latest` it will install version `0.1.0` from the example above. So, when running `npm publish` in a project where the `version` in `package.json` is set to `0.1.0`, the `latest` package distribution tag is an alias to the `0.1.0` version of your package.

But what if you want to publish a version of your package to npm, but you don't want the `latest` alias to point to that version? You may want, for example, to publish a release candidate version (say `1.0.0-rc.0`) so that your users can download it (with `npm i my-awesome-package@1.0.0-rc.0`) and test your upcoming changes before you publish a new patch/minor/major version of your package. But while you want your release candidate to be available on npmjs.com for people to find and download, you don't want this version to show up when users are upgrading their packages, for example, with `npm outdated` and `npm upgrade`, nor when users install it with `npm i my-awesome-package`.

The answer is in the [docs of `npm publish`](https://docs.npmjs.com/cli/v8/commands/npm-publish). Running `npm publish` is the same as running `npm publish --tag latest`. That's why the package version is always mapped to the `latest` distribution tag. You can easily override this, by simply providing a different distribution tag. The mistake I made (guilty for not reading the [distribution tags docs][dist-tag] properly) was that I thought "OK, I can just pass the version of my package as the tag and then the `latest` won't point to it". So I tried:

```shell
npm publish --tag 1.0.0-rc.0
```

only to receive the error message:

```
npm ERR! Tag name must not be a valid SemVer range
```

Going back to [the docs][caveat] helped me understand the issue better. But it was this [StackOverflow answer][so] that really brought the issue home.

> Package distribution tags are not meant to be version numbers. They are aliases to version numbers. They are words like `latest`, `stable`, `next`, `rc`, `experimental`, etc.

So, the correct way to publish a release candidate to npm, without making the `latest` alias point to it is to run

```shell
npm publish --tag rc
```

## Workflow for versioning and publishing

Overall, this is the workflow I follow to version my package and publish it on npm:

**Step 1**: Bump the version of the package with `npm version` to create a git commit and a git tag (not to be confused with package distribution tags as I did above):

```shell
npm version patch # for a patch version
npm version minor # for a minor version
npm version major # for a major version
npm version prerelease --pre-id rc # for a release candidate version
```

**Step 2**: Have a GitHub Action workflow that runs when pushing tags on GitHub. The workflow:

1. reads the name of the tag that was pushed
2. defines the distribution tag (`latest` if the tag matches the pattern `X.Y.Z` or `rc` if it matches the pattern `X.Y.Z-rcN`)
3. runs `npm publish --tag [latest|rc]`

**Step 3**: Push generated tag on GitHub to trigger the workflow

**Step 4**: Profit ✅

## Tips

Something that helped me clear things out in my head was the command `npm view`. You can run it to inspect any published package on npm. For example, you can use it to inspect the distribution tags of a package:

```
$ npm view web3 dist-tags
{ latest: '1.7.1', next: '2.0.0-alpha.1', rc: '1.7.2-rc.0' }
```

[dist-tag]: https://docs.npmjs.com/cli/v8/commands/npm-dist-tag
[publish]: https://docs.npmjs.com/cli/v8/commands/npm-publish
[caveat]: https://docs.npmjs.com/cli/v8/commands/npm-dist-tag#caveats
[so]: https://stackoverflow.com/a/48038690/1644591
