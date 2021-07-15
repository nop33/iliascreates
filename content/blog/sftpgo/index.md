---
title: Applying Problem-Solving Steps for Setting Up an SFTP Server
date: "2020-10-08T16:06:00.000Z"
description: "I need to set-up an SFTP server. How do I do it? Where do I start? What is available out there? This is how I did it. A detailed step-by-step guide on gathering requirements, listing and evaluating options, trying things out and documenting the final solution. Spoiler alert: I chose sftpgo."
---

Last week I had to set-up an FTP service on a server running Ubuntu. I never had to do that before, so that was a new challenge! This is a post explaining how I went through the problem-solving steps and arrived at a satisfying solution.

The first step of problem-solving is to **identify and clarify the actual problem**. After spending a few hours interviewing the people that requested this, I managed to compile the following requirements list.

> Step 1 of problem-solving: identify and clarify the actual problem

## Requirements

1. Clients connecting to it should have read-only access
1. Staff users should have read/write access
1. Clients should only view and access directories they have been given access to
1. Use of SSL/TLS
1. Use of SFTP
1. Easy user management (addition/modification/deletion of users) from non-tech staff
1. Easy directory access management from non-tech staff
1. The staff users should be able to log in via FileZilla
1. The client users should be able to log in via the [`sftp` CLI tool](https://linux.die.net/man/1/sftp)
1. It shouldn't take me more than a week to implement

Nice! Moving on.

## Research

> Step 2 of problem-solving: list the possible solutions

Googling my ass around and keeping the requirements in mind I found some promising projects.
The suggestions from the tech leads were the use of [Pure-FTPd](https://www.pureftpd.org/project/pure-ftpd/) or [vsftpd](https://security.appspot.com/vsftpd.html) since they provide features like _virtual users_ for easier creation/modification of accounts than managing user accounts in Ubuntu. Some more words were thrown in like _jailed home folders_, _softlinks_, _ProFTPD_ and others (:insert confusion:). Lastly, one more suggestion thrown in the mix was [`sftpgo`](https://github.com/drakkan/sftpgo) (which btw had made its way to [Hacker News](https://news.ycombinator.com/item?id=20531541) last year). So, a lot of research to be done and a lot of things to learn!

> Step 3 of problem-solving: Evaluate the options

Looking at the documentation pages of Pure-FTPd and vsftpd it was not hard to decide to start with Pure-FTPd. I couldn't even find an official public versioning system repository for vsftpd. sftpgo also seemed promising and very much actively maintained. So there was my priority list:

1. Pure-FTPd
2. sftpgo
3. vsftpd
4. ProFTPD

## Time to get my hands dirty

> Step 4 of problem-solving: Select an option. If it doesn't work go back and try another.

Earlier this year I got my hands dirty with [Ansible](https://www.ansible.com/) so I thought that this is a perfect opportunity to see if other developers had already created an [Ansible role](https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html) for setting up the aforementioned tools and published it in [Ansible Galaxy](https://galaxy.ansible.com/). I was happy to find 2 roles for Pure-FTPd that seemed promising, although not really actively maintained. I thought it's worth to give them a try. I started with [the one with the highest score](https://galaxy.ansible.com/robgmills/pure-ftpd).

It was expected to find problems with it since it hasn't been updated for years. Fixing them was easy though and so I contributed back to the project with a [pull request](https://github.com/robgmills/ansible-pure-ftpd/pull/6/files).

After some painful hours reading through the [very pleasing to the eye documentation](https://download.pureftpd.org/pub/pure-ftpd/doc/README) of Pure-FTPd and trying a lot of shit and options out, I decided that it is not worth trying to meet my requirements with this project, so I moved on.

sftpgo, your turn.

## sftpgo

From the [project's description](https://github.com/drakkan/sftpgo), sftgo is a _"Fully featured and highly configurable SFTP server with optional FTP/S and WebDAV support. It can serve local filesystem, S3, GCS"_. Sounds good! Unfortunately, no Ansible role for this project. Oh well! Maybe I'll create one :wink:

Reading through the documentation and the how-to's I found quite a few typos. It didn't cost me much to go through all of them and [fix](https://github.com/drakkan/sftpgo/pull/181) what I could find! The maintainer seemed to [appreciate it a lot](https://github.com/drakkan/sftpgo/pull/181#issuecomment-703515718)!

Moving on the installation instructions I found out that _Deb and RPM packages are built after each commit and for each release._ Sweet! To my surprise however, I couldn't find any `deb` files in the release page. I contacted the maintainer through a [GitHub issue](https://github.com/drakkan/sftpgo/issues/182) and I was astonished to receive a reply in just 13 minutes! Kudos to _drakkan_, super mega helpful.

Alright, alright, time to install the shit somewhere. I created a machine on Exoscale and installed Ubuntu 20.04 on it.

### Installing

I downloaded the `deb` package from [GitHub's Actions page](https://github.com/drakkan/sftpgo/actions/runs/289114329) and `rsync`'ed it to the server.

```
$ rsync -av ~/Downloads/sftpgo_1.0.1-1\~dev.77_amd64.deb ubuntu@myftp.domain.name:/home/ubuntu/sftpgo_1.0.1-1\~dev.77_amd64.deb
```

Installed it with:

```
$ sudo apt install ./sftpgo_1.0.1-1~dev.77_amd64.deb
```

Service is already running. Sweeeeet!

```
$ systemctl status sftpgo
● sftpgo.service - SFTPGo Server
     Loaded: loaded (/lib/systemd/system/sftpgo.service; enabled; vendor preset: enabled)
     Active: active (running) since Mon 2020-10-05 13:13:53 UTC; 6min ago
```

### Enabling Web Admin interface, add password protection and HTTPS

sftpgo provides a simple Web Admin interface to manage virtual users, virtual directories and permissions. That meets my requirement 6!

To enable it I updated the configuration to remove `localhost` from the `bind_address`:

```json
// /etc/sftpgo/sftpgo.json
"httpd": {
    "bind_port": 8080,
    "bind_address": ""
    // ...
}
```

and opened port `8080` on the Exoscale interface.

#### Protect with password

To protect the REST API and the Web Admin interface with a password I did the following:

```
$ sudo apt install apache2-utils
$ sudo htpasswd -B -c /etc/sftpgo/httpauth sftpgoweb
```

and updated the configuration:

```json
// /etc/sftpgo/sftpgo.json
"httpd": {
    // ...
    "auth_user_file": "/etc/sftpgo/httpauth",
    // ...
},
```

#### Enabling HTTPS

To enable HTTPS with certbot:

1. Installed certbot:

```
$ sudo snap install core; sudo snap refresh core
$ sudo apt-get remove certbot
$ sudo snap install --classic certbot
$ sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

2. Got the certificate and placed it in appropriate directory:

```
$ sudo certbot certonly
$ sudo mkdir /etc/sftpgo/ssl/
$ sudo cp /etc/letsencrypt/live/myftp.domain.name/cert.pem /etc/sftpgo/ssl/
$ sudo cp /etc/letsencrypt/live/myftp.domain.name/privkey.pem /etc/sftpgo/ssl/
$ sudo chown -R sftpgo:sftpgo /etc/sftpgo/ssl
```

3. Updated the configuration:

```json
// /etc/sftpgo/sftpgo.json
"httpd": {
    // ...
    "certificate_file": "/etc/sftpgo/ssl/cert.pem",
    "certificate_key_file": "/etc/sftpgo/ssl/privkey.pem"
}
```

4. Restarted the server:

```
$ sudo systemctl restart sftpgo
```

BOOM. Requirement 4 is met.

#### Few more things

I set the users base directory to `/var/lib/sftpgo/users` so that the `sftpgo` user who runs the service can create the home folders of the virtual users defined through the Web Admin interface.

```json
// /etc/sftpgo/sftpgo.json
"data_provider": {
    "driver": "sqlite",
    // ...
    "users_base_dir": "/var/lib/sftpgo/users",
    // ...
  }
```

By the way, after having a short conversation with the maintainer, he [addressed this](https://github.com/drakkan/sftpgo/issues/118#issuecomment-704385118) and added it to the default options. Such responsive, much fast replies, wow! :D

Finally, I enabled port `2022` in Exoscale to allow SFTP connections.

Aaaand, we're done! Let's test now to see if all the requirements are met.

## Testing

To satisfy requirement 2, I logged in into the Web Admin interface and created a virtual user called **staff**, added a password, selected the (\*) permissions, so that it can do all operations (create folders, upload files, etc) and saved.

To satisfy requirement 1 and 3, I logged in into the Web Admin interface and created a virtual user called **vuser1**, added a password, selected the (list, download) permissions, so that it can only see the folders it has access to and download their contents and saved. Nice, requirement 7: check!

To create a directory on the server and upload a file, I logged in with the **staff** virtual user via FileZilla (which caused the automatic creation of the home folder of the **staff** virtual user under `/var/lib/sftpgo/users/staff`) and through FileZilla's interface created a folder called `reports`. I uploaded a file in there. Ciao, requirement 8!

To give the **vuser1** virtual user access to the `reports` folder, I logged in into the Web Admin interface and edited the **vuser1** virtual user and added the virtual folder `vreports` with the mapping `/vreports::/var/lib/sftpgo/users/staff/reports`. Done with requirement 7 as well!

To verify that everything worked, I logged in into the server with the **vuser1** account and I could only see a `vreports` folder with the content that the **staff** virtual user uploaded in `/var/lib/sftpgo/users/staff/reports`. Requirement 9: bye-bye.

```
$ sftp sftp://vuser1@myftp.domain.name:2022
vuser1@myftp.domain.name's password:
Connected to myftp.domain.name.
sftp> ls
vreports
sftp> cd vreports
sftp> ls
SWTM-2088_Atlassian-Git-Cheatsheet.pdf
```

Mucho success!

## Documentation

> Step 5 of problem-solving: Document your solution

Might be easy to forget or to think as not important, but documenting the solution will actually save a lot of time and headaches in the case someone else (or your future self) will come back to maintain it.

I made sure to create a documentation entry and make it available to the rest of the developers. This post acts as documentation as well :)

I also considered our poor non-tech staff colleagues that will have to use the Web Admin interface, so I made sure to write some user manuals for them as well. Specifically, the hardest part I believe is the whole concept of _virtual folders_. This is how I tried to explain it to them:

### User manual: How to give users access to folders

Before you dive into giving access to folders you have created you must understand the concept of _Virtual folders_. A virtual folder is a folder that is simply a _link_ between a folder you have created on the FTP server through FileZilla and what the user (client) sees when they login into the FTP server. Let's see this through an example:

Let's assume that you have the following folder structure on the FTP server: 1 main folder called `reports` with 2 subfolders called `weekly-reports` and `monthly-reports`, each of which contains 2 files:

```
reports/
├── weekly-reports/
│   ├── week50.csv
│   └── week51.csv
└── monthly-reports/
    ├── month1.csv
    └── month2.csv
```

Let's also assume that you want to give access to the user called `user1` to the folder `weekly-reports` and that you don't want the user to be aware of the folder `reports` or of the folder `monthly-reports`. Instead, you want that when they login into the server to see a folder called `virtual-weekly-reports-folder` that has the contents `week50.csv` and `week51.csv`.

To do that, you need to edit the `user1` user through the Web Admin interface and create a virtual folder for them.

Virtual folders follow this structure:

```
/<virtual-folder-name>::<prefix><folder-you-created-in-filezilla>
```

The `<prefix>` should always have the value `/var/lib/sftpgo/users/staff/`.

If we replace `<virtual-folder-name>` with `virtual-weekly-reports-folder`, the `<prefix>` with the value above and `<folder-you-created-in-filezilla>` with `reports/weekly-reports` we have the following row:

```
/virtual-weekly-reports-folder::/var/lib/sftpgo/users/staff/reports/weekly-reports
```

By adding this row in the _Virtual folders_ field of the user page in the Web Admin interface, when the `user1` user logs in into the FTP server, they will see the following folder structure:

```
virtual-weekly-reports-folder/
├── week50.csv
└── week51.csv
```

## Conclusion

Even for a frontend-er like myself that lacks experience regarding Linux and system administration compared to other more experienced geeks, applying the simple problem-solving steps and having determination and patience, _solved my problems_ XD. And don't forget to document the shit out of everything!

Thanks for reading :)
