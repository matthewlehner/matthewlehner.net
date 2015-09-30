---
title: React Hot Module Replacement With Webpack
date: 2015-09-30 17:23 UTC
meta_description: Set up Webpack's hot module replacement with React. Here's how to set it up for use with we'll set it up with React
tags: draft
---

Out of the box, webpack supports a fancy new alternative to full page refreshes.
Hot module replacement replaces the live code running on your development
machine. The major benefit of hot module replacement is that state is not lost –
if you've had to click a number of things to get to the point in your app that
you're working on, you won't perform a full page refresh and lose the history of
those actions.

Increasing the speed of of your feedback loop means that your time will be
focused more on building your app, than clicking through a sequence you've
clicked through 50 times already. There's nothing more frustrating than
troubleshooting some UI bug that's at the end of 8 actions.

## Install and Configure Webpack

First, initialize a new project and install `webpack`.

```shell
mkdir react-hmr
cd react-hmr
git init
npm init
npm install -g webpack
npm install --save-dev webpack
```

Now, let's get webpack set up. We'll need three parts to make this work, some
JavaScript, an `index.html`, and a webpack configuration to wire everything
together.

The `index.html` will go in the base directory of the project.

```xml
<!DOCTYPE html>
<html>
  <head>
    <title>React HMR example</title>
  </head>
  <body>
    <script src="/static/bundle.js"></script>
  </body>
</html>
```

A very, very basic JavaScript application:

```javascript
document.write("Webpack is doing it's thing.");
```

And the webpack configuration in `webpack.config.js`. Webpack requires an
application entry point, and an output file for the compiled JavaScript
application.

```javascript
module.exports = {
  entry: "./index.js",
  output: {
    path: __dirname,
    filename: "bundle.js",
    publicPath: "/static/"
  }
}
```

Now, if you run `webpack` from the project directory will compile `index.js` to
`bundle.js`. Great stuff, but it would be even more useful if we had a server
running so that can view our results in the browser.

## Webpack Dev Server

Webpack also has a light weight development server that will serve the
assets that it compiles. We'll use this going forward so that we can see the
results of our work in the browser. Install it now:

```shell
npm install webpack-dev-server -g
npm install webpack-dev-server --save-dev
```

Now we can run `webpack-dev-server` and visit `http://localhost:8080` to view
the results of our work. 👍

This is great, but if you alter the contents of `index.js`, you'll notice that
nothing happens. We want webpack to recompile our application, and notify the
page to reload. To do this, run the command with the following flags:

```
webpack-dev-server --progress --inline
```

* `--progress` displays the compilation progress when building
* `--inline` adds webpacks automatic refresh code inline with the compile
  application

#### TIP: Reduce global dependencies!
When sharing code with multiple people, it's convienient to give a single API
for getting started. I recommend adding the following entry to `package.json`
within the `"scripts"` object.

```json
{
  "scripts": {
    "start": "./node_modules/webpack-dev-server/bin/webpack-dev-server.js --progress --inline"
  }
}
```

By referencing the webpack dev server directly, rather than with a global
executable it makes it more simple to get up an running. Now, when someone
clones your repository, they can run `npm install` and `npm start` to launch
the development server.

## Adding Babel and React

