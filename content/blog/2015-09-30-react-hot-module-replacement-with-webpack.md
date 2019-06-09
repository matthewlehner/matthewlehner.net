---
title: Using Webpack's Hot Module Replacement with React
date: 2015-09-30
description:
  Set up webpack to provide hot module replacement for React. Using BabelJS and
  the babel-preset-react-hmre preset, enabling HMR is only a few lines of
  configuration.
tags: [react]
path: "react-hot-module-replacement-with-webpack"
---

Out of the box, webpack supports a fancy new alternative to live reload to see
if your changes worked called hot module replacement, or HMR. At its core, HMR
works by watching changes to files, and signaling the browser to replace
specific modules, or functions, but not reload the entire page.

The major benefit of hot module replacement is that state is not lost – if
you've had to perform a number of actions to get to a specific state, you won't
perform a full page refresh and lose the history of those actions.

Here it is at work – notice that the timer doesn't reset to 0 as it would after
a page reload, and css changes auto refresh too.

![React hot module replacement at work](./react-hmr.gif)

  <figcaption>React Hot Module Replacement at work</figcaption>

Increasing the speed of your feedback loop frees time to do meaningful work and
removes frustrating, repetitive activities from your workflow. If you're
interested in a more in depth explanation of how it works, check out the answer
to [What exactly is Hot Module Replacement in Webpack][what-is-hmr] on
Stackoverflow.

By the end of this, you'll have webpack set up with React and HMR. If you get
stuck at all, have a look at the [example repo][example-repo].

_Acknowledgments:_ I have to give a big shout out and thank you to [Dan
Abramov][dan-abramov], his open source work, and his talk [Live React: Hot
Reloading with Time Travel][time-travel-react] at react-europe. Without his
contributions to the community, setting up HMR for React would be a lot more
difficult. Thanks Dan!

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

```html
<!DOCTYPE html>
<html>
  <head>
    <title>React HMR example</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="/static/bundle.js"></script>
  </body>
</html>
```

Edit `index.js` to run a bit of JavaScript just so we know it's working:

```javascript
document.write("Webpack is doing its thing.");
```

Then add the following webpack configuration to `webpack.config.js`. Webpack
requires an application entry point and an output file for the compiled
JavaScript.

```javascript
module.exports = {
  entry: "./index.js",
  output: {
    path: __dirname,
    filename: "bundle.js",
    publicPath: "/static/"
  }
};
```

Now, if you run `webpack` from the project directory, it will compile `index.js`
to `bundle.js`. Great stuff, but it would be even more useful if we had a server
running so that can view our results in the browser.

## Webpack Dev Server

Webpack also has a light weight development server that we'll be using to serve
the assets that it compiles. We'll use this going forward so that we can see the
results of our work in the browser. Install it now:

```shell
npm install webpack-dev-server -g
npm install webpack-dev-server --save-dev
```

Now we can run `webpack-dev-server` and visit `http://localhost:8080` to view
the results of our work. 👍

This is works, but we want our application to update when we make changes to it.
Right now, if you alter the contents of `index.js`, nothing happens. Instead, we
want webpack to recompile our application, and notify the page to reload. To do
this, run the command with the following flags:

```shell
webpack-dev-server --progress --inline
```

- `--progress` displays the compilation progress when building
- `--inline` adds webpacks automatic refresh code inline with the compile
  application

### TIP: Reduce global dependencies!

When sharing code with multiple people, it's better to keep things simple. I
recommend adding the following entry to `package.json` within the `"scripts"`
object.

```json
{
  "scripts": {
    "start": "webpack-dev-server --progress --inline"
  }
}
```

By referencing the webpack dev server within an npm script, rather than with a
global executable we no longer rely on a global version of webpack and can use
different versions of webpack in different projects. Now, when someone clones
your repository, they can run `npm install` and `npm start` to launch the
development server.

From now on, use `npm start` to run the webpack dev server.

## Adding Babel and React

Now we've got a development environment that gives us quick feedback, so let's
add in the interesting stuff: Babel for transpiling JSX and ES2015 (and
beyond!), and React for the UI.

As of Babel 6, we also need to install a few presets for ES2015 and JSX.

Shut down the dev server and install Babel:

```shell
npm install babel-core babel-loader babel-preset-es2015 babel-preset-react --save-dev
```

Now we need to add this to our webpack build pipeline. Add the following beneath
the `output` object in `webpack.config.js`:

```javascript
module.exports = {
  // entry and output options

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        include: __dirname,
        query: {
          presets: ["es2015", "react"]
        }
      }
    ]
  }
};
```

Loaders are webpack's equivalent to preprocessors. The webpack
[documentation][1] describes them like this:

> Loaders are kind of like “tasks” are in other build tools, and provide a
> powerful way to handle frontend build steps. Loaders can transform files from
> a different language like, CoffeeScript to JavaScript, or inline images as
> data URLs.

To test out the babel-loader and make sure it's working with the presets,
restart your dev server with `npm start` and change `index.js` to include some
ES2015 flavoured JavaScript:

```javascript
let docBody = "Webpack is doing its thing, with ES2015!";
document.write(docBody);
```

Webpack will compile this and the browser will update with the string we've
used. Great! Now we can add React and ReactDOM into the mix by running:

```shell
npm install react react-dom --save
```

**Note:** Because React is required for our application to run, we're using
`--save` rather than `--save-dev`.

Now we'll add a simple component and render it to the document body instead of
the string we're currently rendering.

We'll create an `App` component in `components/App.js`:

```jsx
import React, { Component } from "react";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
  }

  componentDidMount() {
    this.interval = setInterval(this.increment.bind(this), 1000);
  }

  increment() {
    this.setState(({ counter }) => {
      return { counter: counter + 1 };
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { counter } = this.state;

    return (
      <header>
        <div>Webpack is doing its thing with React and ES2015</div>
        <div>{counter}</div>
      </header>
    );
  }
}
```

Now, change `index.js` to import the component and render it to the container
`div`:

```javascript
import { render } from "react-dom";
import React from "react";
import App from "./components/App";

const containerEl = document.getElementById("container");

render(<App />, containerEl);
```

Now our component initializes a counter which increments a number every second.
It's not a very interesting component, but for our purposes it's a good
demonstration of how state is lost when the browser reloads a page. By default
webpack will trigger an entire page reload, which means that we lose the
component's state. We can solve this with hot module replacement.

## Enabling Hot Module Replacement (HMR)

To enable it for us, we need to turn on hot reloading within Webpack itself, and
add the appropriate React tools to compile the modules with HMR support.

```shell
npm install --save-dev babel-preset-react-hmre
```

These are a Babel preset that allows HMR to be applied to React components.
Because these are presets for Babel, the only thing we have to do to get it
working is add `react-hmre` to our array of presets.

```javascript
module.exports = {
  // entry and output options

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        include: __dirname,
        query: {
          presets: ["es2015", "react", "react-hmre"]
        }
      }
    ]
  }
};
```

and edit our `start` script in `package.json` to enable the hot option:

```json
{
  "scripts": {
    "start": "webpack-dev-server --progress --inline --hot"
  }
}
```

Now everything should be working as we anticipated in our dev environment, but
there are few final things to consider.

## Caveats

The webpack config that we've put together here is very basic, if you bundle
your app for production using this configuration you will be including HMR code
within your app.

I would encourage you to modularize your webpack config for the different build
environments you'll need as production builds can differ greatly from what's
used in development.

That said, this is a great starting point for an initial webpack config!

If you get stuck, have a look at the [example repo][example-repo].

[1]: http://webpack.github.io/docs/loaders.html
[what-is-hmr]:
  http://stackoverflow.com/questions/24581873/what-exactly-is-hot-module-replacement-in-webpack#answer-24587740
[time-travel-react]: https://www.youtube.com/watch?v=xsSnOQynTHs
[dan-abramov]: https://twitter.com/dan_abramov
[example-repo]: https://github.com/matthewlehner/react-hmr-example
