# ![LINE](./public/images/small.png) LINE WebChat
[![NPM](https://img.shields.io/badge/npm-%3E=%205.5.0-blue.svg)](https://nodejs.org/) [![Node](https://img.shields.io/badge/node-%3E=%208.0.0-brightgreen.svg)](https://nodejs.org/) [![AUR](https://img.shields.io/aur/license/yaourt.svg)](https://github.com/GoogleX133/LINE-WebChat/blob/master/LICENSE) [![LINE](https://img.shields.io/badge/line-%207.18-brightgreen.svg)](http://line.me/) [![Contact Me](https://img.shields.io/badge/chat-on%20line-1bacbc.svg)](http://line.me/ti/p/MB6mnZWbu_) [![Version](https://img.shields.io/badge/alpha-2.1-1bbc30.svg)](https://github.com/GoogleX133/LINE-WebChat)<br><br>
LINE Messaging Web Platform

----

PAGES
=====

- [What is LINE WebChat ?](#what-is-line-webchat-)
    - [Features](#features)
    - [Upcoming Feature](#upcoming-update)
- [Requirement](#requirement)
- [Installation](#)
    - [Windows](#windows-installation)
    - [Linux](#linux-installation)
    - [Termux](#linux-installation)
- [How to run](#how-to-run)
- [Guide](#guide)


## What is LINE WebChat ?

LINE WebChat is a modified *LINE Messaging App* based on web platform.

## Features

- Chatting
    - Group Chat
    - Chat Notification
- Authentication
    - Login with QR
    - Login with authToken
- Console

## Upcoming Update

- Chatting
    - Square Chat
    - Person Chat
    - SendImage
- Authentication
    - Login with email & pass

<br><br>
If you have an idea for new feature, you can contact [me](http://line.me/ti/p/MB6mnZWbu_).

## Requirement

This repo require a [NodeJS](https://nodejs.org/) >= 8.0.0.

## Windows Installation

First of all, you need to install [Git](https://git-scm.com/download/win) & [NodeJS](https://nodejs.org/). Then open your git bash, and follow this:<br>
```sh
$ git clone https://github.com/GoogleX133/LINE-WebChat.git
$ cd LINE-WebChat
$ npm i
```

## Linux Installation

```sh
$ sudo apt-get update
$ sudo apt-get install git-all
$ sudo apt-get install nodejs
$ git clone https://github.com/GoogleX133/LINE-WebChat.git
$ cd LINE-WebChat
$ npm i
```

## How to run

- On windows you just open *start.bat*.
- On linux you just open *start.sh*.

## Guide

- How to access the main chat page ?. simple, just go to *http://127.0.0.1:1337/*.
- How to access the console ?. go to *http://127.0.0.1:1337/console*.
