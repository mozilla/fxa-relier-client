fxa-relier-client
=================

Client JS library for FxA reliers

## Relier API docs
See [API.md](./API.md).

## fxa-relier-client developer API docs
Prebuilt relier-client developer API docs are in the [gh-pages](https://github.com/mozilla/fxa-relier-client/tree/gh-pages) branch. Docs can also be generated with the `grunt doc` command.

## Development Prerequisites

* npm
* Grunt (`npm install -g grunt-cli`)

## Grunt Commands

[Grunt](http://gruntjs.com/) is used to run common tasks to build, test, and run local servers.

| TASK | DESCRIPTION |
|------|-------------|
| `grunt build` | build production resources. See [task source](grunttasks/build.js) for more documentation |
| `grunt clean` | remove any built production resources. |
| `grunt dev` | watch for changes to source files, run unit tests on changes. |
| `grunt doc` | generate API docs from YUIdoc tags embedded in source. |
| `grunt lint` | run JSHint, JSONLint, and JSCS (code style checker) on client side and testing JavaScript. |
| `grunt test` | run local Intern tests. |
| `grunt release` | create a new release. creates a `release` branch with current code, creates a new tag, updates the CHANGELOG.md, pushes updates to GitHub. |

## License

MPL 2.0
