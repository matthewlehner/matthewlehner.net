---
title: npm Basics for Rubyists
date: 2015-11-17T23:22Z
meta_description: A quick start guide about npm for Rubyists entering the node.js ecosystem. Compare Ruby gems and bundler to their node.js and npm equivalents.
path: "/npm-basics-for-rubyists"
---

I recently began using npm in parallel with Sprockets on a Rails project. The
front end needs had grown beyond the scope of what the default Rails & Sprockets
configuration could handle – we're no longer just sprinkling JavaScript and have
a few complex front end apps. For front end development, this is a much better
story than copying files to the vendor directory, or adding frontend library
gems to the Gemfile.

npm is the best choice for JS package management for two reasons: it is bundled
with node.js, and the recent release of npm 3 fixes its past quirks for use in
front end web apps.

## Past problems with npm

The main problem with npm in the past has been that peer dependencies were not
flattened, so it may have been requiring multiple versions of the same
dependency, like this:

```
lib-a v1.0.0
  ↳ dependency-a v0.8
lib-b v1.0.0
  ↳ dependency-a v0.9
```

Older versions of npm (pre 3.x) nested peer dependencies, which meant that both
versions of `dependency-a` were included in your app bundle. For the front end,
this duplication meant the size of the compiled JavaScript would be much larger
than anticipated, and could create bugs from version errors.

As of npm 3.3 this dependency tree has been flattened. Peer dependencies must be
installed explicitly, removing the duplication and allowing complete control
over their versions. Clearing up the nested dependency problem removes the main
advantage that other JavaScript package managers (like Bower) had over npm.

### npm — Node Package Manager

There are two key things to know when getting started with npm, how to install
dependencies, and where they are specified.

##### `npm install`

This command by itself is roughly equivalent to `bundle install`, it installs
the dependencies listed in `package.json`. Generally, running `npm install` is
the step directly after cloning a project with node.js dependencies.

##### `package.json`

In the node.js ecosystem, `package.json` is roughly equivalent to Bundler's
`Gemfile`. Project dependencies and their required versions are listed here, as
well as configuration, and customized scripts relating to the project.

When entering an unfamiliar project, this is the first place to look.

### Installing dependencies

In the Ruby ecosystem there are two ways to install gems, directly with
`gem install gemname`, or via the `Gemfile` with Bundler. In node.js, npm is the
only way to install node packages.

In Ruby, gems are installed system wide and if you've installed a gem, it is
available for any project. npm has two ways of installing packages – globally,
or locally.

Global installation is similar to running `gem install` – it installs the
package to a globally configured node directory, however, global packages are
not available locally within local projects. Global packages are typically used
for utilities and tooling.

Local installation is npm's default behaviour and will make the installed
packages available within the current directory. If you are in
`~/code/app-time`, running `npm install backbone` will install to
`~/code/app-time/node_modules/backbone`.

Here's a quick overview of the different commands:

#### Global Dependencies

In npm, you would typically use global installed packages for tooling or
utilities you will use often for multiple purposes. Examples of packages that
are typically installed globally are:

* [svgo][svgo-link]
* [eslint][eslint-link]
* [coffee-script][cs-link]

```sh
# Ruby
# installs the Rails gem globally
gem install rails

# npm
# Installs the express package globally
npm install svgo -g
```

#### Project dependencies

Modern Ruby projects typically use Bundler for managing dependencies and stores
these in the project's `Gemfile`. node.js uses npm and `package.json`,
respectively.

* `npm install` – Installs dependencies listed in `package.json`<br> **Ruby
  equivalent:** `bundle install`<br>

* `npm install react --save` – Installs the React package and saves an entry to
  it in `package.json`<br> **Ruby equivalent:** add a gem to the `Gemfile` and
  run `bundle install`.

* `npm install webpack --save-dev` – Installs the webpack package and saves an
  entry to the `dev-dependencies` section of `package.json`<br> **Ruby
  equivalent:** add a gem to the development group in the `Gemfile` and run
  `bundle install`.

* `npm install node-sass` – Installs a package, but doesn't reference it
  anywhere. This is not useful, unless you're simply testing a package.<br>
  **Ruby equivalent:** none..

#### Running Locally Installed Executables

Unlike the `Gemfile`, `package.json` has more responsibilities than listing
dependencies and can include configuration options, as well as customizable
scripts.

Because dependencies are installed to a relative directory, the executable
binaries aren't in your shell's `PATH` variable. In order to run a locally
installed binary, you must prefix the command with `npm run`. For example, if
you wanted to install and run svgo in a local folder, you would do the
following:

```sh
# installs svgo and saves it to `package.json`
npm install svgo --save

# runs the svgo binary located in the `node_modules` directory
npm run svgo
```

In addition to this, you can configure different scripts to run by default using
the `scripts` section of `package.json`. Here's an example:

```json
{
  "scripts": {
    "test": "mocha --compilers js:babel-core/register --recursive",
    "test:watch": "npm run test -- --watch"
  }
}
```

This configuration will add `npm run test` and `npm run test:watch` to the
project.

For further reading, see the [Using a `package.json`][package-docs] section of
the npm documentation.

[svgo-link]: https://github.com/svg/svgo
[eslint-link]: http://eslint.org
[cs-link]: http://coffeescript.org
[node-sass-link]: https://github.com/sass/node-sass
[package-docs]: https://docs.npmjs.com/getting-started/using-a-package.json
