---
title: "Authoring commits with different emails for work and personal projects"
date: "2021-02-28T19:35:00.000Z"
description: "What if you want to use a different email address to author your commits depending on which project you are working on?"
---

I like to store all my git repositories, of both work and personal projects, under a single directory at `~/dev`. I think I'll change this to `~/code` soon, it sounds more appropriate. Anyway, back to the topic.

At the top of my `~/.gitconfig` file I have configured the git `user` (which represents the commit author) to use my personal email address:

```
[user]
  name = Ilias Trichopoulos
  email = ilias.personal@gmail.com
```

However, when I work in git repositories of projects for my work, I want the author of my commits to have my work email address. The simplest way I found to achieve this is to dedicate a directory for all my work-related git repositories and create a separate `.gitconfig` file there. Then, I can conditionally include this new file in my main `.gitconfig` depending on which project I am working on.

In my case, I have all my work-related projects under `~/dev/company-name`. I created a new `.gitconfig` file there where the only contents are:

```
[user]
  email = ilias.work@company-name.com
```

Git 2.13 introduced the feature of [Conditional includes](https://git-scm.com/docs/git-config#_conditional_includes) which allows you to include a dedicated `.gitconfig` file depending on where the git repository is located.

Adding the following configuration at the bottom of my main `~/.gitconfig` file ensures that when I work in a git repository located at `~/dev/company-name/project1`, the author of my commits will have the `ilias.work@company-name.com` email address.

```
[user]
  name = Ilias Trichopoulos
  email = ilias.personal@gmail.com

...

[includeIf "gitdir:~/dev/company-name/"]
  path = ~/dev/company-name/.gitconfig
```

Credits to [this StackOverflow answer](https://stackoverflow.com/a/43654115/1644591) that showed me the way.
