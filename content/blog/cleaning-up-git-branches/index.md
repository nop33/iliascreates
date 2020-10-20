---
title: Git alias to clean up local branches
date: "2020-10-20T21:54:00.000Z"
description: "How to create a git alias to clean up already merged local branches. And some things to watch out for."
---

I really enjoy crafting my own git aliases! They save so much time!

Today I created the alias `git cleanbr`. Can you guess what it does? XD

Yes, it cleans local branches that have already been merged into the current branch (exluding some that should not be deleted). It looks like this:

```
cleanbr = ! git branch -d `git branch --merged | grep -v '^*\\|main\\|master\\|staging\\|devel'`
```

So what's going on here? Let's break it down:

`git branch --merged` will show all branches that have been merged to the current branch. For example:

```
$ git branch --merged
  fix-typo
  devel
* master
  update-readme
```

We need to clean this list up and give it as an input to the `git branch -d` which deletes the specified local branches. By cleaning up I mean to exclude the branches that we don't want to delete. In my case, I want to avoid deleting the `main`<sup>[1]</sup>, `master`, `staging` and `devel` even if they are already merged to my current branch (`master` in the example). To do that, we'll use the `grep -v` (`-v` for exclusion) and provide the regular expression to match any of the aforementioned branches.

The `!` in the beginning of the alias is to treat the command as a new shell command<sup>[2]</sup>, otherwise you'll get this error:

```
fatal: malformed object name |
```

Another way to solve this is to create a function:

```
cleanbr = "!f() { git branch -d `git branch --merged | grep -v '^*\\|main\\|master\\|staging\\|devel'`; }; f"
```

If there is nothing to clean you'll see this message:

```
fatal: branch name required
```

## Tricky part

Something that took me a bit of time to figure out was the fact that piping the result of `git branch --merged` to `git branch -d` was giving me this error:

```
error: branch 'fix-typo?[m' not found.
error: branch 'update-readme?[m' not found.
```

WTF is this strange `?[m` characters...? I cannot see them in the terminal, but when I write the output of `git branch --merged` in a file and open it with vim, I can.

After trying a few things out, I reached out to StackOverflow with a [question](https://stackoverflow.com/questions/64442502/how-to-remove-m-and-32-characters-in-vim) and very quickly a good soul gave me the [answer](https://stackoverflow.com/a/64442570/1644591). The problem was that in my `.gitconfig` file, I had enabled the `color.ui` setting to `always`. This way, git was not skipping to color the output when redirected, ending up in using the ASCII character codes to color the output. Changing the setting to `auto` fixed my issue. Another solution (if for some reason you want to keep this setting to `always`) is to use the `--no-color` flag.

## Conclusion

So go ahead, change it to fit your preferences, edit your `~/.gitconfig` file and add the following in your aliases. And don't forget your coloring settings!

```
[alias]
    cleanbr = ! git branch -d `git branch --merged | grep -v '^*\\|main\\|master\\|staging\\|devel'`
[color]
    ui = auto
```

[1]: https://github.com/github/renaming
[2]: https://stackoverflow.com/a/19525426/1644591
