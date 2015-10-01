---
title: Using Webpack with Phoenix and Elixir
date: 2015-07-30 02:38 UTC
tags: draft
---

<i>This guide was heavily inspired by Manuel Kallenbach's guide [Automatically
Building Your Phoenix Assets with Webpack][1], which got me started very
quickly.</i>

Phoenix, by default, uses Brunch for a build tool – and for most folks, it'll
work, but I've grown fond of some of the features of Webpack such as [hot module
replacement][2] and the ability to easily add loaders or processors to the build
process.

By the end of this guide, you'll have parity with the default Brunch
configuration that Phoenix comes with.

Let's begin with a new Phoenix application, we won't be using the `--no-brunch`
flag. `--no-brunch` assumes that you'll be managing your frontend assets
statically and changes the directory structure slightly.

When you're asked to install dependencies, say no.

```bash
mix phoenix.new webpack_integration
```

Next, we'll remove the brunch specific configuration:

```bash
rm brunch-config.js
```

And remove the brunch packages from the dependencies object in `package.json`.
When that's done, `package.json` should look like this:

```json
{
  "repository": {
  },
  "dependencies": {
  }
}
```









Then, we'll use `npm init` to create a blank `package.json` and install Webpack.
`package.json` is the entrypoint and configuration for the node.js portion of
the app.

```bash
npm init
npm install --save-dev webpack
```
To get webpack working, we'll have to create a basic `webpack.config.js` in the
root directory of the Phoenix project.

```javascript
module.exports = {
  entry: "./web/static/js/app.js",
  output: {
    path: "./priv/static/js",
    filename: "app.js"
  }
};
```

Now we'll tell Phoenix to run webpack when running the development server:
```elixir
 watchers: [{Path.expand("node_modules/webpack/bin/webpack.js"),
            ["--watch", "--colors", "--progress"]}]
```




[1]: http://manukall.de/2015/05/01/automatically-building-your-phoenix-assets-with-webpack/
[2]: http://webpack.github.io/docs/hot-module-replacement-with-webpack.html
