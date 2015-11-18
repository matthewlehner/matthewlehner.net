---
title: npm Basics for Rubyists
date: 2015-11-17 23:22 UTC
tags: 
---

I recently added npm to a Rails project in order to manage our frontend
dependencies. For front end development, this is a much better story than the
typical copy js files to the vendor directory, or adding
`frontend-library-rails` to the Gemfile. It's my opinion that npm has come out
as the better choice for frontend dependencies recently and will continue to
hold this title.

npm is required for the other JS package managers, most of which were trying to
solve the issue for specific use cases.

## Past problems with npm
The main problem with npm in the past has been that peer dependencies were not
flattened, so your dependency graph could look like this:

```
lib-a v1.0.0
  ↳ dependency-a v0.8
lib-b v1.0.0
  ↳ dependency-a v0.9
```

Older versions of npm (pre 3.x) nested peer dependencies, which would mean that
both versions of `dependency-a` were included in your app bundle. For front end,
this duplication meant the size of the compiled JavaScript would be much larger
than anticipated, and also added _interesting_ (read: horrible and difficult to
debug) side effects. npm 3.3 flattens this graph, so peer dependencies are no
longer nested in this manner, instead, you must specify the desired version of
the peer dependency. Until now, this was the main advantage that other
JavaScript package managers (like Bower) had over npm, but with this problem
solved, it's the clear most simple path for dependencies.

### npm — Node Package Manager

There are two key things to know about with npm

##### `npm install`

This command by itself is roughly equivalent to `bundle install`, it installs
the dependencies listed in `package.json`. Generally, running `npm install` is
the step directly after cloning a project with node.js dependencies.

##### `package.json`

In the node.js ecosystem, `package.json` is roughly equivalent to Bundler's
`Gemfile`. Project dependencies and their required versions are listed here, as
well as configuration, and customized scripts relating to the project.

When entering an unfamiliar project, this is the first place to look.

That's it, if you're not doing any other front end work in a project, you
probably won't have to touch `package.json`, and will only have to run `npm i`
when the dependencies need to be updated.

### Installing dependencies

In the Ruby ecosystem, there are two ways to install gems, directly with `gem
install gemname`, or via the `Gemfile` with Bundler. All gems are installed
system wide, or scoped to a user account, but if you've installed a gem, it is
available for any project.

npm has two ways of installing packages, globally, or locally. Global
installation is similar to running `gem install` – it installs the package to
a globally configured node directory and if this is added to your path, you'll
be able to run any binaries that it installs.

However, npm's default behaviour is to install the package locally, to whatever
directory you are currently in. If you are in your home directory and install a
package, npm will install it to `~/node_modules/package-name`.

Here's a quick overview of the different commands:

#### Global Dependencies
In npm, you would typically use global installed packages for tooling or
utilities you will use often for multiple purposes. Examples of packages that
are often installed globally are:

- [svgo][svgo-link]
- [eslint][eslint-link]
- [coffee-script][cs-link]

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
however, the responsibilities of `package.json` are not solely limited to
listing dependencies and can include configuration for dependencies, as well as
scripts to run these dependencies.

The major difference between gems in Ruby and packages in node is where they are
installed. In Ruby, all gems are installed globally, which can result in version
conflicts when running a command like `rails` if multiple versions of the Rails
gem are installed.

By default, npm installs packages to a `node_modules` directory, relative to the
directory you are in. It will not add an entry to `package.json`, but the
package will exist for you locally. Typically one will use the `--save` or
`--save-dev` flags when installing packages as this saves a record of it to
`package.json`.

The differences arise when installing packages – there are a number of options
available:

- `npm install` – Installs dependencies listed in `package.json`<br>
  **Ruby equivalent:** `bundle install`<br>

- `npm install react --save` – Installs the React package and saves an entry to
  it in `package.json`<br>
  **Ruby equivalent:** add a gem to the `Gemfile` and run `bundle install`.

- `npm install webpack --save-dev` – Installs the webpack package and saves an
  entry to the `dev-dependencies` section of `package.json`<br>
  **Ruby equivalent:** add a gem to the development group in the `Gemfile` and
  run `bundle install`.

- `npm install node-sass` – Installs a package, but doesn't reference it
  anywhere. This is not useful, unless you're simply testing a package.<br>
  **Ruby equivalent:** none..

#### Running Locally Installed Executables

Here's where the main difference between the npm and gem/bundler paradigm is
really apparent – because dependencies are installed to a relative directory,
the executable binaries aren't in your shell's `PATH` variable. In order to run
a locally installed binary, you must prefix the command with `npm run`. For
example, if you wanted to install and run svgo in a local folder, you would do
the following:

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
