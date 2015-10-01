---
title: Using Webpack with Phoenix and Elixir
date: 2015-07-30 02:38 UTC
tags: draft
---

<i>This guide was heavily inspired by Manuel Kallenbach's guide [Automatically
Building Your Phoenix Assets with Webpack][phoenix-webpack-post], which got me
started down this path. My goal here is to provide a 1-to-1 mapping of webpack
to the default Brunch setup that comes with Phoenix.</i>

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
so anything that relies on this syntax will cause a compilation issue with
webpack.

At this point, the only thing we'll want to run is:

```javascript

// Ensure that this import is commented out for now.
// import "deps/phoenix_html/web/static/js/phoenix_html"

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

## Adding Babel and CSS Support

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

This rules state that any file ending in `.js` that is required within the
application will be run through Babel. Once it is in place, restart the server,
and you'll have support for all the great JavaScript features that Babel has to
offer.

#### Setting load paths

With webpack, using `import` or `require` expects an explicit path, relative to
the file you're working in. For exmample, if you have the following files:

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
compatibility with the Brunch configuration we'll have to add a few load paths
so that we can require relative modules.

Add the following `webpack.config.js`:

```javascript
var path = require('path');

module.exports = {
  // Leave the entry, output, and module options we set previously...

  resolve: {
    modulesDirectories: [ __dirname ]
  }
}
```

Now we can add back the `phoenix_html` module in `web/static/js/app.js`:

```javascript
import "deps/phoenix_html/web/static/js/phoenix_html";
```

Restart the Phoenix server, and we should now have the Phoenix JavaScript
included in our compiled file.

### CSS and Webpack

If you've used webpack before, you've probably seen CSS being required from
within the individual components of your application. Instead of generating
separate CSS files, webpack will inline any CSS required when loading the page.
Again, since we're aiming for the exact functionality that Brunch provided,
we'll have to separate out the CSS from our JavaScript bundle. Implementing our
CSS compilation this way is slightly different from the way it is normally
demonstrated in webpack tutorials.

We need both the style and css loaders to actually parse and compile `css` files
to their correct location. On top of this, we need the
`extract-text-webpack-plugin` to pull the CSS out of our bundle and output it
to its own file.

```
npm install css-loader extract-text-webpack-plugin --save-dev
```

Now we'll add an additional entry point for webpack pointing to the
`app.css` file, redefine the output path to account for CSS and JS locations,
add the style and css loaders, and configure the `ExtractText` plugin to output
the individual CSS file. Here's what `webpack.config.js` file should look like
when you're done:

```javascript
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: ["./web/static/js/app.js", "./web/static/css/app.css"],
  output: {
    path: "./priv/static",
    filename: "js/app.js"
  },

  resolve: {
    modulesDirectories: [ __dirname ]
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ["babel"],
      include: __dirname
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("css")
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
moves them to `priv/static`, so `web/static/assets/favicon.ico` will move to
`priv/static/favicon.ico`.

This is something that webpack is not well suited for. We can get it to move
files that are required within CSS or JS, but it simply isn't made for copying
files from one place to another. Instead, we'll copy the files ourselves:

```sh
cp -R web/static/assets/**/* priv/static
```
and update `.gitignore` to reflect this change:

```
# /priv/static/ - Comment this line out, and add the following two lines.
/priv/static/js/
/priv/static/css/
```

And that's it. We're all done!

[phoenix-webpack-post]: http://manukall.de/2015/05/01/automatically-building-your-phoenix-assets-with-webpack/
[webpack-hmr-docs]: http://webpack.github.io/docs/hot-module-replacement-with-webpack.html
