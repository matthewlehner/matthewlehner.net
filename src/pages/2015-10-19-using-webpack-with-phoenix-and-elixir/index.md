---
title: Using Webpack with Phoenix and Elixir
date: 2015-10-19T02:38Z
meta_description: Set up webpack as Phoenix's front end build tool to take advantage of hot module replacement and intelligent optimization for your front end app.
image: webpack-and-phoenix-on-elixir.svg
tags: elixir, phoenix, webpack
path: "/using-webpack-with-phoenix-and-elixir"
---

_Updated October 13, 2016 for Phoenix 1.2.1 and webpack 1.13_

Phoenix, by default, uses Brunch for a build tool – and for most folks, it'll
work, but I've grown fond of webpack because of features like [hot module
replacement][webpack-hmr-docs] and the ease of configuring loaders/processors in
the build process. In my opinion, Elixir and Phoenix is the best for choice for
server side architecture currently, so, naturally these should be paired with
the best client side tools.

By the end of this guide, you'll have wepback running at parity with the default
Brunch configuration that Phoenix comes with. Here's an [example
repo][webpack-phoenix-example].

## Initializing the Phoenix Application

Let's begin with a new Phoenix application, we won't be using the `--no-brunch`
flag. `--no-brunch` assumes that you'll be managing your frontend assets
statically and changes the directory structure slightly. It's easier to remove
Brunch rather than recreate the directory structure manually.

When you're asked to install dependencies, say no.

```bash
mix phoenix.new webpack_integration
```

Next, we'll remove the Brunch specific configuration:

```bash
rm brunch-config.js
```

Then remove the Brunch packages from the dependencies object in `package.json`.
When that's done, `package.json` should look like this:

```json
{
  "repository": {},
  "license": "MIT",
  "scripts": {
    "deploy": "brunch build --production",
    "watch": "brunch watch --stdin"
  },
  "dependencies": {
    "phoenix": "file:deps/phoenix",
    "phoenix_html": "file:deps/phoenix_html"
  },
  "devDependencies": {
  }
}
```

There are still scripts which mention brunch, we'll get to those later on.

## Adding Webpack

Installing webpack may cause npm to output warnings because of missing fields in
`package.json`, like the name, etc. For our purposes, these fields are not
important. That said, if you do want a fresh `package.json`, run `npm init` to
generate an empty version of it.

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

To run webpack, we'll add an entry to the `scripts` section of `package.json`.
This will allow us to run webpack on its own, with our preferred command line
options by running `npm start` at the command line.

```json
{
  "scripts": {
    "watch": "webpack --watch-stdin --progress --color"
  }
}
```

Now we'll tell Phoenix to run webpack as a watcher while running the development
server. Edit the `watchers` option in `config/dev.exs` to look like this:

```elixir
config :webpack_integration, WebpackIntegration.Endpoint,
  # leave other settings and change the `watchers` option.
  watchers: [npm: ["run", "watch"]]
```

**Notes For Windows Users:** npm doesn't play very well with Windows so rather
than using npm scripts to run webpack, we run it via node.js directly. Thanks to
Keith and Kanmii for pointing this out.

Change your watchers options in `config/dev.exs` to:

```elixir
  watchers: [ node: [ "node_modules/webpack/bin/webpack.js",
                      "--watch-stdin --progress --color",
                      cd: Path.expand("../", __DIR__) ] ]
```

Start up your server again with `mix phoenix.server` and we'll test that webpack
is working..

Start by editing `web/static/js/app.js`. Make sure that the
entire file is commented out – we don't have any ES2015 compilation working yet,
so anything that relies on this syntax will cause a compilation issue with
webpack.

At this point, the only thing we'll want to run is:

```javascript

// Ensure that this import is commented out for now.
// import "phoenix_html"

alert('webpack compiled me.');
```

Now you can install the dependencies, set up the database and run the server.

```sh
mix deps.get
mix ecto.create
mix phoenix.server
```

Now, when you open `http://localhost:4000` you'll see the alert, but we don't
have any JS or CSS processing set up. We'll fix that next.

## Adding Babel for JavaScript

Out of the box, webpack doesn't compile CSS, or JavaScript written with ES2015
syntax for you, so we'll have to add the required loaders. Let's get started
with Babel for JavaScript compilation.

Install babel, and the babel loader for webpack:

```sh
npm install babel-loader babel-core babel-preset-es2015 --save-dev
```

and add the following after the `output` options in `webpack.config.js`:

```javascript
module.exports = {
  // entry and output options...

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel",
      query: {
        presets: ["es2015"]
      }
    }]
  }
}
```

This rules state that any file ending in `.js` that is required within the
application will be run through Babel. Once it is in place, restart the server,
and you'll have support for all the great JavaScript features that Babel has to
offer.

#### Setting load paths

With webpack, using `import` or `require` expects an explicit path, relative to
the file you're working in. For example, if you have the following files:

```
app.js
components/filePicker.js
```

To require `filePicker` from within `app.js` it'd look like this:

```javascript
// Brunch
import filePicker from 'components/filePicker';

// Webpack
import filePicker from './components/filePicker';
```

This is not better or worse, just different. Since we're aiming for complete
compatibility with the Brunch configuration we'll have to add a configuration
option to tell it to look in `web/static/js` for a module. While we're at it,
we'll also tell webpack to look in the `node_modules` directory for any packages
we install through npm.

Add the following `webpack.config.js`:

```javascript
module.exports = {
  // Leave the entry, output, and module options we set previously

  resolve: {
    modulesDirectories: [ "node_modules", __dirname + "/web/static/js" ]
  }
}
```

If you're upgrading from an older version of Phoenix, you _may_ have to add the
`phoenix_html` and `phoenix` packages statically in `package.json`. If you don't
already have an entry for them in your dependencies, we'll use npm to manage the
`phoenix_html` and `phoenix` module dependencies. The JS packages are already
included in the Elixir packages installed using hex, so we need to bring them
into our `node_modules` directory with npm.

```bash
# If you've already got the Phoenix dependencies in package.json:
npm install

# If you need to move them into package.json:
npm install file:deps/phoenix_html file:deps/phoenix --save
```

and now we can import the modules normally:

```javascript
import "phoenix_html";
import { Socket } from "phoenix";
```

Restart the Phoenix server, and you should have the Phoenix JavaScript modules
included in our compiled file.

### CSS and Webpack

If you've used webpack before, you've probably seen CSS being required from
within the individual components of your application. Instead of generating
separate CSS files, webpack will inline any CSS required when loading the page.
Since we're aiming for the exact functionality that Brunch provided,
we'll have to separate out the CSS from our JavaScript bundle. Implementing our
CSS compilation this way is slightly different from the way it is normally
demonstrated in webpack tutorials.

We need both the style and css loaders to actually parse and compile `css` files
to their correct location. On top of this, we need the
`extract-text-webpack-plugin` to pull the CSS out of our bundle and output it
to its own file.

```
npm install css-loader style-loader extract-text-webpack-plugin --save-dev
```

Now we'll add an additional entry point for webpack pointing to the
`app.css` file, redefine the output path to account for CSS and JS locations,
add the style and css loaders, and configure the `ExtractText` plugin to output
the individual CSS file. Here's what `webpack.config.js` file should look like
when you're done:

```javascript
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: ["./web/static/css/app.css", "./web/static/js/app.js"],
  output: {
    path: "./priv/static",
    filename: "js/app.js"
  },

  resolve: {
    modulesDirectories: [ "node_modules", __dirname + "/web/static/js" ]
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel",
      include: __dirname,
      query: {
        presets: ["es2015"]
      }
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style", "css")
    }]
  },

  plugins: [
    new ExtractTextPlugin("css/app.css")
  ]
};
```

With this configuration, webpack will grab the `web/static/css/app.css` file,
parse the CSS and move it to `priv/static/css/app.css`. Restart your Phoenix
server to see the stylesheets working. The only thing missing now are the static
assets.

## Handling Static Assets

Last but not least, we need to move our static assets so that they're
accessible. By default, Phoenix stores static assets in `web/static/assets` and
moves them to `priv/static`, so `web/static/assets/favicon.ico` will be moved to
`priv/static/favicon.ico`.

To do this, install the `copy-webpack-plugin`:

```bash
npm install --save-dev copy-webpack-plugin
```

and add its configuration to the plugins array in `webpack.config.js`:

```javascript
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports {
  // ...
  plugins: [
    new ExtractTextPlugin("css/app.css"),
    new CopyWebpackPlugin([{ from: "./web/static/assets" }])
  ]
}
```

There is one gotcha to this approach – assets are not automatically copied when
added to `web/static/assets`. With this configuration, you are required to
restart webpack when a file is added to this directory.

## Building for Production

The last step in this process is to tell elixir webpack to build production
ready assets, this is simple. From the command line, run:

```bash
webpack -p
```

I've added this as a script in `package.json` like so:

```json
{
  "scripts": {
    "deploy": "webpack -p"
  }
}
```

And that's it. We're all done! Run `npm run deploy` to build your assets during
your deploy process and everything will work the same way that it did with
Brunch.

If you get stuck, have a look at my [example repo][webpack-phoenix-example]. The
important files are `package.json`, `webpack.config.js`, and `dev/config.exs`.

Good luck!

_This guide was inspired by Manuel Kallenbach's guide [Automatically
Building Your Phoenix Assets with Webpack][phoenix-webpack-post]. This article
provides a 1-to-1 mapping of webpack to the default Brunch setup that comes with
Phoenix._


[phoenix-webpack-post]: http://manukall.de/2015/05/01/automatically-building-your-phoenix-assets-with-webpack/
[webpack-hmr-docs]: http://webpack.github.io/docs/hot-module-replacement-with-webpack.html
[webpack-phoenix-example]: https://github.com/matthewlehner/phoenix-webpack-example
