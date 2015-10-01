---
title: Using Webpack with Phoenix and Elixir
date: 2015-07-30 02:38 UTC
tags: draft
---

<i>This guide was heavily inspired by Manuel Kallenbach's guide [Automatically
Building Your Phoenix Assets with Webpack][phoenix-webpack-post], which got me
started down this path. My goal here is to provide a 1-to-1 mapping of webpack
to the default brunch setup that comes with Phoenix.</i>

Phoenix, by default, uses Brunch for a build tool – and for most folks, it'll
work, but I've grown fond of webpack because of features like [hot module
replacement][webpack-hmr-docs] and the ease of configuring loaders/processors in
the build process.

By the end of this guide, you'll have wepback running at parity with the default
Brunch configuration that Phoenix comes with.

## Initializing the Phoenix Application

Let's begin with a new Phoenix application, we won't be using the `--no-brunch`
flag. `--no-brunch` assumes that you'll be managing your frontend assets
statically and changes the directory structure slightly. It's easier to remove
brunch rather than recreate the directory structure manually.

When you're asked to install dependencies, say no.

```bash
mix phoenix.new webpack_integration
```

Next, we'll remove the brunch specific configuration:

```bash
rm brunch-config.js
```

Then remove the brunch packages from the dependencies object in `package.json`.
When that's done, `package.json` should look like this:

```json
{
  "repository": {
  },
  "dependencies": {
  }
}
```

## Adding Webpack

Installing webpack will cause npm to throw some warnings because `package.json`
is missing a few fields, like the name, license, etc. For our purposes these
fields are not important, but you can add them by running `npm init` if you feel
like it.

To install webpack, run:

```bash
npm install --save-dev webpack
```

And then add a basic webpack config. By default webpack looks for
`webpack.config.js` in the root directory of the project, so create the file
with the following contents:

```javascript
module.exports = {
  entry: "./web/static/js/app.js",
  output: {
    path: "./priv/static/js",
    filename: "app.js"
  }
};
```

This configuration tells webpack to look for `web/static/js/app.js` and compile
it to `priv/static/js/app.js`.

Now we'll tell Phoenix to run webpack when running the development server. Edit
the `watchers` option in `config/dev.exs` to look like this:

```elixir
  watchers: [node: ["node_modules/webpack/bin/webpack.js",
                    "--watch-stdin", "--progress", "--colors"]]
```

Now, we'll test this by editing `web/static/js/app.js`. Make sure that the
entire file is commented out – we don't have any ES2015 compilation working yet,
so anything that relies on this syntax will not work.

At this point, the only thing we'll want to run is:

```javascript
alert('webpack compiled me.');
```

Now you can install the dependencies, set up the database and run the server.

```sh
mix deps.get
mix ecto.create
mix phoenix.server
```

Now, when you open `http://localhost:4000` you'll see the alert, but CSS isn't
being compiled, and we don't have support for ES2015. We'll fix that next.

## Adding Babel and Sass Support to Webpack

Out of the box, webpack doesn't compile Sass, or JavaScript written with ES2015
syntax for you, so we'll have to add the required loaders. Let's get started
with Babel for JavaScript compilation.

Install babel, and the babel loader for webpack:

```sh
npm install babel-loader babel-core --save-dev
```

and add the following after the `output` options in `webpack.config.js`:

```javascript
module.exports = {
  // entry and output options...

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ["babel"],
      include: __dirname
    }]
  }
}
```

That's it. Restart the server, and you'll have support for all the great
JavaScript features that Babel has to offer.

### Sass and Webpack
Now we'll get Sass working. If you've used webpack before, you have probably
seen how the general practices usually include `requiring` CSS within the
individual components of your application. Since we're aiming for the exact
functionality that Brunch provided, we'll have to implement our Sass compilation
in a slightly different manner than is normal for webpack.




[phoenix-webpack-post]: http://manukall.de/2015/05/01/automatically-building-your-phoenix-assets-with-webpack/
[webpack-hmr-docs]: http://webpack.github.io/docs/hot-module-replacement-with-webpack.html
